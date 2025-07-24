const supabase = require('../utils/supabase');
const { getISTISOString } = require('../utils/dateUtils');

exports.requestWithdrawal = async (req, res, next) => {
  try {
    const { amount, upi, emailOtp } = req.body;
    const userId = req.user.id;

    console.log('Withdrawal request:', { userId, amount, upi });

    // Validate required fields
    if (!amount || !upi || !emailOtp) {
      return res.status(400).json({ error: 'Amount, UPI, and OTP are required' });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Get user and verify OTP
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('otp, upi')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.otp !== emailOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Verify UPI matches user's UPI
    if (user.upi !== upi) {
      return res.status(400).json({ error: 'UPI does not match your registered UPI' });
    }

    // Calculate user's total earnings from links
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('earnings, createdat')
      .eq('user_id', userId);

    if (linksError) {
      console.error('Error fetching links:', linksError);
      return res.status(500).json({ error: 'Failed to calculate balance' });
    }

    const linkEarnings = links.reduce((sum, link) => sum + (link.earnings || 0), 0);

    // Get referral earnings
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('earnings_amount')
      .eq('referrer_id', userId);

    let referralEarnings = 0;
    if (!referralsError && referrals) {
      referralEarnings = referrals.reduce((sum, r) => sum + (r.earnings_amount || 0), 0);
    }

    // Total earnings = link earnings + referral earnings
    const totalEarnings = linkEarnings + referralEarnings;

    // Get all withdrawals (requested and completed)
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('amount, status, date')
      .eq('user_id', userId)
      .in('status', ['requested', 'completed'])
      .order('date', { ascending: false });

    if (withdrawalsError) {
      console.error('Error fetching withdrawals:', withdrawalsError);
      return res.status(500).json({ error: 'Failed to check withdrawals' });
    }

    // Calculate pending withdrawals (only requested status)
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'requested');
    const pendingAmount = pendingWithdrawals.reduce((sum, withdrawal) => sum + (withdrawal.amount || 0), 0);

    // Calculate total withdrawn amount (completed withdrawals)
    const completedWithdrawals = withdrawals.filter(w => w.status === 'completed');
    const totalWithdrawn = completedWithdrawals.reduce((sum, withdrawal) => sum + (withdrawal.amount || 0), 0);

    // Find the last completed withdrawal date
    const lastCompletedWithdrawal = completedWithdrawals
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    let availableBalance = 0;
    
    if (lastCompletedWithdrawal) {
      // Calculate earnings from last withdrawal to now
      const lastWithdrawalDate = new Date(lastCompletedWithdrawal.date);
      
      // Get link earnings from last withdrawal to now
      const recentLinks = links.filter(link => {
        const linkDate = new Date(link.createdat);
        return linkDate > lastWithdrawalDate;
      });
      const recentLinkEarnings = recentLinks.reduce((sum, link) => sum + (link.earnings || 0), 0);
      
      // Get referral earnings from last withdrawal to now using the new tracking system
      let recentReferralEarnings = 0;
      try {
        const { data: recentReferrals, error: recentReferralsError } = await supabase
          .from('referral_earnings_log')
          .select('amount')
          .eq('referrer_id', userId)
          .gt('earned_at', lastWithdrawalDate.toISOString());

        if (!recentReferralsError && recentReferrals) {
          recentReferralEarnings = recentReferrals.reduce((sum, r) => sum + (r.amount || 0), 0);
        }
      } catch (err) {
        console.error('Error fetching recent referral earnings:', err);
        // Fallback to total referral earnings if tracking table doesn't exist
        recentReferralEarnings = referralEarnings;
      }
      
      // Available balance = recent earnings - pending withdrawals
      availableBalance = recentLinkEarnings + recentReferralEarnings - pendingAmount;
    } else {
      // No previous withdrawals, available balance = total earnings - pending withdrawals
      availableBalance = totalEarnings - pendingAmount;
    }

    // Ensure available balance is not negative
    availableBalance = Math.max(0, availableBalance);

    console.log('Withdrawal validation:', {
      totalEarnings,
      linkEarnings,
      referralEarnings,
      pendingAmount,
      totalWithdrawn,
      availableBalance,
      lastWithdrawalDate: lastCompletedWithdrawal?.date,
      requestedAmount: amount
    });

    // Check if user has sufficient balance
    if (amount > availableBalance) {
      return res.status(400).json({ 
        error: 'Insufficient balance', 
        availableBalance: availableBalance.toFixed(2),
        requestedAmount: amount,
        totalEarnings: totalEarnings.toFixed(2),
        linkEarnings: linkEarnings.toFixed(2),
        referralEarnings: referralEarnings.toFixed(2),
        pendingWithdrawals: pendingAmount.toFixed(2),
        totalWithdrawn: totalWithdrawn.toFixed(2)
      });
    }

    // Check minimum withdrawal amount (e.g., 400 rupees)
    // if (amount < 400) {
    //   return res.status(400).json({ error: 'Minimum withdrawal amount is ₹400' });
    // }

    // Insert withdrawal request
    const { data: withdrawal, error: insertError } = await supabase
      .from('withdrawals')
      .insert([{
        user_id: userId,
        amount: amount,
        upi: upi,
        status: 'requested',
        date: getISTISOString()
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting withdrawal:', insertError);
      return res.status(500).json({ error: 'Failed to create withdrawal request' });
    }

    // Clear OTP after successful withdrawal request
    await supabase
      .from('users')
      .update({ otp: null })
      .eq('id', userId);

    console.log('Withdrawal request created:', withdrawal);
    res.json({ 
      message: 'Withdrawal requested successfully',
      withdrawal: {
        id: withdrawal.id,
        amount: withdrawal.amount,
        status: withdrawal.status,
        date: withdrawal.date
      },
      availableBalance: (availableBalance - amount).toFixed(2) // Show remaining balance after withdrawal
    });
  } catch (err) {
    console.error('Error in requestWithdrawal:', err);
    next(err);
  }
};

exports.completeWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    console.log('Completing withdrawal:', { withdrawalId: id, adminId });

    // Check if withdrawal exists
    const { data: withdrawal, error: fetchError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    // Check if withdrawal is already completed
    if (withdrawal.status === 'completed') {
      return res.status(400).json({ error: 'Withdrawal is already completed' });
    }

    // Update withdrawal status to completed
    const { data: updatedWithdrawal, error: updateError } = await supabase
      .from('withdrawals')
      .update({ 
        status: 'completed',
        processed_at: getISTISOString(),
        processed_by: adminId
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating withdrawal:', updateError);
      return res.status(500).json({ error: 'Failed to complete withdrawal' });
    }

    console.log('Withdrawal completed:', updatedWithdrawal);
    res.json({ 
      message: 'Withdrawal marked as completed',
      withdrawal: updatedWithdrawal
    });
  } catch (err) {
    console.error('Error in completeWithdrawal:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserWithdrawals = async (req, res) => {
  try {
    const userId = req.user.id;

    // console.log('Fetching withdrawals for user:', userId);

    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching withdrawals:', error);
      return res.status(500).json({ error: error.message });
    }

    // console.log('Found withdrawals:', data.length);
    res.json(data);
  } catch (err) {
    console.error('Error in getUserWithdrawals:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get withdrawal statistics for admin
exports.getWithdrawalStats = async (req, res) => {
  try {
    // console.log('Fetching withdrawal statistics');

    // Get all withdrawals
    const { data: withdrawals, error } = await supabase
      .from('withdrawals')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching withdrawals:', error);
      return res.status(500).json({ error: error.message });
    }

    // Calculate statistics
    const totalWithdrawals = withdrawals.length;
    const totalAmount = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'requested');
    const completedWithdrawals = withdrawals.filter(w => w.status === 'completed');
    const failedWithdrawals = withdrawals.filter(w => w.status === 'failed');

    const pendingAmount = pendingWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    const completedAmount = completedWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

    // Get recent withdrawals (last 10)
    const recentWithdrawals = withdrawals.slice(0, 10);

    res.json({
      totalWithdrawals,
      totalAmount,
      pendingWithdrawals: pendingWithdrawals.length,
      pendingAmount,
      completedWithdrawals: completedWithdrawals.length,
      completedAmount,
      failedWithdrawals: failedWithdrawals.length,
      recentWithdrawals
    });
  } catch (err) {
    console.error('Error in getWithdrawalStats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all withdrawals for admin
exports.getAllWithdrawals = async (req, res) => {
  try {
    // console.log('Fetching all withdrawals for admin');

    const { data, error } = await supabase
      .from('withdrawals')
      .select(`
        *,
        users!user_id(firstname, lastname, email, upi)
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching withdrawals:', error);
      return res.status(500).json({ error: error.message });
    }

    // Transform data to include user info
    const withdrawalsWithUser = data.map(withdrawal => ({
      id: withdrawal.id,
      amount: withdrawal.amount,
      upi: withdrawal.upi,
      status: withdrawal.status,
      date: withdrawal.date,
      processed_at: withdrawal.processed_at,
      user: {
        name: `${withdrawal.users.firstname || ''} ${withdrawal.users.lastname || ''}`.trim(),
        email: withdrawal.users.email,
        upi: withdrawal.users.upi
      }
    }));

    // console.log('Found withdrawals:', withdrawalsWithUser.length);
    res.json(withdrawalsWithUser);
  } catch (err) {
    console.error('Error in getAllWithdrawals:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Reject withdrawal
exports.rejectWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    //  console.log('Rejecting withdrawal:', { withdrawalId: id, adminId, reason });

    // Check if withdrawal exists
    const { data: withdrawal, error: fetchError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    // Check if withdrawal is already processed
    if (withdrawal.status !== 'requested') {
      return res.status(400).json({ error: 'Withdrawal is already processed' });
    }

    // Update withdrawal status to rejected
    const { data: updatedWithdrawal, error: updateError } = await supabase
      .from('withdrawals')
      .update({ 
        status: 'rejected',
        rejection_reason: reason,
        processed_at: getISTISOString(),
        processed_by: adminId
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating withdrawal:', updateError);
      return res.status(500).json({ error: 'Failed to reject withdrawal' });
    }

    //  console.log('Withdrawal rejected:', updatedWithdrawal);
    res.json({ 
      message: 'Withdrawal rejected successfully',
      withdrawal: updatedWithdrawal
    });
  } catch (err) {
    console.error('Error in rejectWithdrawal:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 