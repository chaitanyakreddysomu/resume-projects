const supabase = require('../utils/supabase');
const sendMail = require('../utils/mailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { getOtpEmailHtml } = require('../utils/otpEmailTemplate');
const { getISTDateString } = require('../utils/dateUtils');

exports.getProfile = async (req, res, next) => {
  try {
    // console.log('req.user:', req.user);
    const { data: user, error } = await supabase
      .from('users')
      .select('firstname,lastname,email,phone,profilephoto,role,verified,upi')
      .eq('id', req.user.id)
      .single();

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(404).json({ error: 'User not found in database' });
    }

    if (!user) {
      console.warn('No user found for ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    // console.log('User data found:', user);
    return res.status(200).json(user);
  } catch (err) {
    console.error('Controller error:', err);
    next(err);
  }
};

exports.updatePersonal = async (req, res, next) => {
  try {
    const { firstname, lastname, phone, profilePhoto } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updateData = {};
    if (firstname !== undefined) updateData.firstname = firstname;
    if (lastname !== undefined) updateData.lastname = lastname;
    if (phone !== undefined) updateData.phone = phone;
    if (profilePhoto !== undefined) updateData.profilephoto = profilePhoto;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to update personal info: ' + error.message });
    }

    res.status(200).json({ message: 'Personal info updated successfully', user: data });
  } catch (err) {
    console.error('Error in updatePersonal:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateSecurity = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, enable2FA } = req.body;

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select()
      .eq('id', req.user.id)
      .single();

    if (fetchError) {
      return res.status(500).json({ error: 'Failed to fetch user' });
    }

    if (newPassword) {
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) return res.status(400).json({ error: 'Old password incorrect' });

      const hashed = await bcrypt.hash(newPassword, 10);
      const { error: updatePassError } = await supabase
        .from('users')
        .update({ password: hashed })
        .eq('id', req.user.id);

      if (updatePassError) {
        return res.status(500).json({ error: 'Failed to update password' });
      }
    }

    if (enable2FA !== undefined) {
      const { error: update2FAError } = await supabase
        .from('users')
        .update({ enable2FA })
        .eq('id', req.user.id);

      if (update2FAError) {
        return res.status(500).json({ error: 'Failed to update 2FA status' });
      }
    }

    res.json({ message: 'Security settings updated' });
  } catch (err) {
    console.error('Unexpected error in updateSecurity:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
    const { upi1, upi2, emailOtp } = req.body;
    const { data: user } = await supabase.from('users').select().eq('id', req.user.id).single();
    if (user.otp !== emailOtp) return res.status(400).json({ error: 'Invalid OTP' });
    await supabase.from('users').update({ upi1, upi2, otp: null }).eq('id', req.user.id);
    res.json({ message: 'Payment info updated' });
  } catch (err) { next(err); }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's links with earnings data
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .order('createdat', { ascending: false });

    if (linksError) {
      console.error('Error fetching links:', linksError);
      return res.status(500).json({ error: 'Failed to fetch links' });
    }

    // Calculate earnings from links
    const linkEarnings = links.reduce((sum, link) => sum + (link.earnings || 0), 0);
    const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
    const activeLinks = links.filter(link => link.status === 'active').length;

    // Calculate monthly earnings (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyLinks = links.filter(link => 
      new Date(link.createdat) >= thirtyDaysAgo
    );
    const monthlyEarnings = monthlyLinks.reduce((sum, link) => sum + (link.earnings || 0), 0);

    // Calculate daily earnings (today)
    const today = getISTDateString();
    const todayLinks = links.filter(link => 
      link.createdat && link.createdat.startsWith(today)
    );
    const dailyEarnings = todayLinks.reduce((sum, link) => sum + (link.earnings || 0), 0);

    // Get recent links for dashboard
    const recentLinks = links.slice(0, 5).map(link => ({
      short: link.url,
      original: link.originalurl,
      clicks: link.clicks || 0,
      createdAt: link.createdat,
      expiry: link.expirydate,
      todayClicks: 0, // This would need to be calculated from link_views table
      todayEarnings: 0 // This would need to be calculated from link_views table
    }));

    // Get earnings overview for chart (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const earningsOverview = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLinks = links.filter(link => 
        link.createdat && link.createdat.startsWith(dateStr)
      );
      const dayEarnings = dayLinks.reduce((sum, link) => sum + (link.earnings || 0), 0);
      
      earningsOverview.push({
        date: dateStr,
        amount: dayEarnings
      });
    }

    // Get referral information
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('earnings_amount, total_referred_earnings')
      .eq('referrer_id', userId);

    let referralEarnings = 0;
    let totalReferredEarnings = 0;
    
    if (!referralsError && referrals) {
      referralEarnings = referrals.reduce((sum, r) => sum + (r.earnings_amount || 0), 0);
      totalReferredEarnings = referrals.reduce((sum, r) => sum + (r.total_referred_earnings || 0), 0);
    }

    // Total earnings = link earnings + referral earnings
    const totalEarnings = linkEarnings + referralEarnings;

    res.json({
      totalEarnings,
      linkEarnings,
      monthlyEarnings,
      dailyEarnings,
      clicks: totalClicks,
      activeLinks,
      earningsOverview,
      links: recentLinks,
      referralEarnings,
      totalReferredEarnings,
      referredUsersCount: referrals?.length || 0
    });
  } catch (err) { 
    console.error('Error in getDashboard:', err);
    next(err); 
  }
};

exports.getEarnings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's links with earnings data
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId);

    if (linksError) {
      console.error('Error fetching links:', linksError);
      return res.status(500).json({ error: 'Failed to fetch links' });
    }

    // Calculate total earnings from links
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
    const total = linkEarnings + referralEarnings;

    // Calculate current month earnings (only from links for now, referral earnings are real-time)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyLinks = links.filter(link => {
      const linkDate = new Date(link.createdat);
      return linkDate.getMonth() === currentMonth && linkDate.getFullYear() === currentYear;
    });
    const currentMonthEarnings = monthlyLinks.reduce((sum, link) => sum + (link.earnings || 0), 0);

    // Get all withdrawals (requested and completed)
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('amount, status, date')
      .eq('user_id', userId)
      .in('status', ['requested', 'completed'])
      .order('date', { ascending: false });

    if (withdrawalsError) {
      console.error('Error fetching withdrawals:', withdrawalsError);
      return res.status(500).json({ error: 'Failed to fetch withdrawals' });
    }

    // Calculate pending withdrawals (only requested status)
    const pendingWithdrawals = withdrawals
      .filter(w => w.status === 'requested')
      .reduce((sum, withdrawal) => sum + (withdrawal.amount || 0), 0);

    // Calculate total withdrawn amount (completed withdrawals)
    const totalWithdrawn = withdrawals
      .filter(w => w.status === 'completed')
      .reduce((sum, withdrawal) => sum + (withdrawal.amount || 0), 0);

    // Find the last completed withdrawal date
    const lastCompletedWithdrawal = withdrawals
      .filter(w => w.status === 'completed')
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
      availableBalance = recentLinkEarnings + recentReferralEarnings - pendingWithdrawals;
    } else {
      // No previous withdrawals, available balance = total earnings - pending withdrawals
      availableBalance = total - pendingWithdrawals;
    }

    // Ensure available balance is not negative
    availableBalance = Math.max(0, availableBalance);

    console.log('Earnings calculation:', {
      total,
      linkEarnings,
      referralEarnings,
      pendingWithdrawals,
      totalWithdrawn,
      availableBalance,
      lastWithdrawalDate: lastCompletedWithdrawal?.date,
      userId,
      linksCount: links.length,
      withdrawalsCount: withdrawals.length
    });

    res.json({
      total,
      linkEarnings,
      referralEarnings,
      currentMonth: currentMonthEarnings,
      pendingWithdrawals,
      totalWithdrawn,
      availableBalance: availableBalance,
      lastWithdrawalDate: lastCompletedWithdrawal?.date || null
    });
  } catch (err) { 
    console.error('Error in getEarnings:', err);
    next(err); 
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's withdrawal requests
    const { data: withdrawals, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching withdrawals:', error);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }

    const transactions = withdrawals.map(withdrawal => ({
      amount: withdrawal.amount,
      upi: withdrawal.upi,
      status: withdrawal.status,
      date: withdrawal.date
    }));

    res.json(transactions);
  } catch (err) { 
    console.error('Error in getTransactions:', err);
    next(err); 
  }
};

// Get user earnings analytics
exports.getEarningsAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's links with earnings data
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .order('createdat', { ascending: false });

    if (linksError) {
      console.error('Error fetching links:', linksError);
      return res.status(500).json({ error: 'Failed to fetch links' });
    }

    // Calculate total stats from links
    const linkEarnings = links.reduce((sum, link) => sum + (link.earnings || 0), 0);
    const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
    const activeLinks = links.filter(link => link.status === 'active').length;

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

    // Get earnings by time period
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const last30DaysEarnings = links
      .filter(link => new Date(link.createdat) >= last30Days)
      .reduce((sum, link) => sum + (link.earnings || 0), 0);

    const last7DaysEarnings = links
      .filter(link => new Date(link.createdat) >= last7Days)
      .reduce((sum, link) => sum + (link.earnings || 0), 0);

    const last24HoursEarnings = links
      .filter(link => new Date(link.createdat) >= last24Hours)
      .reduce((sum, link) => sum + (link.earnings || 0), 0);

    // Get top performing links
    const topPerformingLinks = links
      .sort((a, b) => (b.earnings || 0) - (a.earnings || 0))
      .slice(0, 5)
      .map(link => ({
        id: link.id,
        url: link.url,
        originalurl: link.originalurl,
        clicks: link.clicks || 0,
        earnings: link.earnings || 0,
        cpm: link.cpm,
        status: link.status
      }));

    // Get earnings trend (last 30 days)
    const earningsTrend = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLinks = links.filter(link => 
        link.createdat && link.createdat.startsWith(dateStr)
      );
      const dayEarnings = dayLinks.reduce((sum, link) => sum + (link.earnings || 0), 0);
      
      earningsTrend.push({
        date: dateStr,
        earnings: dayEarnings
      });
    }

    res.json({
      totalEarnings,
      linkEarnings,
      referralEarnings,
      totalClicks,
      activeLinks,
      last30DaysEarnings,
      last7DaysEarnings,
      last24HoursEarnings,
      topPerformingLinks,
      earningsTrend
    });
  } catch (err) {
    console.error('Error in getEarningsAnalytics:', err);
    next(err);
  }
};

// Send OTP for withdrawal request
exports.sendWithdrawalOtp = async (req, res) => {
  try {
    // Get user email and UPI first
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, firstname, upi')
      .eq('id', req.user.id)
      .single();

    if (userError || !user) {
      console.error('Error fetching user:', userError);
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.upi) {
      return res.status(400).json({ error: 'UPI ID not found. Please set up your UPI ID first.' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to user
    const { error: otpError } = await supabase
      .from('users')
      .update({ otp })
      .eq('id', req.user.id);

    if (otpError) {
      console.error('Error saving OTP:', otpError);
      return res.status(500).json({ error: 'Failed to generate OTP' });
    }

    // Send OTP email
    const html = getOtpEmailHtml({
      username: user.firstname || user.email,
      appname: 'Linkearn',
      otp,
      action: 'withdrawal'
    });
    
    await sendMail(user.email, 'Your OTP for Withdrawal Request', html);

    console.log('Withdrawal OTP sent successfully to:', user.email);
    res.json({ message: 'OTP sent to your email for withdrawal confirmation' });
  } catch (err) {
    console.error('Error sending withdrawal OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Send OTP for UPI add/delete
exports.sendUpiOtp = async (req, res) => {
  try {
    const { upiId, action } = req.body;
    if (!upiId) return res.status(400).json({ error: 'UPI ID required' });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to user
    await supabase.from('users').update({ otp }).eq('id', req.user.id);

    // Get user email
    const { data: user } = await supabase.from('users').select('email').eq('id', req.user.id).single();

    // Send OTP email
    const html = getOtpEmailHtml({
      username: user.firstname || user.email,
      appname: 'Linkearn',
      otp,
      action // 'add' or 'delete'
    });
    await sendMail(user.email, 'Your OTP for UPI', html);

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Error sending UPI OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Verify OTP and update UPI
exports.verifyUpiOtp = async (req, res) => {
  try {
    const { upiId, otp, action } = req.body;
    if (!upiId || !otp) return res.status(400).json({ error: 'UPI ID and OTP required' });

    // Get user and check OTP
    const { data: user } = await supabase.from('users').select('otp').eq('id', req.user.id).single();
    if (!user || user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

    // Update UPI and clear OTP
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ upi: upiId, otp: null })
      .eq('id', req.user.id)
      .select('upi')
      .single();

    if (updateError) {
      console.error('Error updating UPI:', updateError);
      return res.status(500).json({ error: 'Failed to save UPI' });
    }

    console.log('UPI updated successfully:', updatedUser);
    res.json({ message: 'UPI verified and saved', upi: updatedUser.upi });
  } catch (err) {
    console.error('Error verifying UPI OTP:', err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// Delete UPI with OTP
exports.deleteUpiWithOtp = async (req, res) => {
  try {
    const { upiId, otp } = req.body;
    if (!upiId || !otp) return res.status(400).json({ error: 'UPI ID and OTP required' });

    // Get user and check OTP
    const { data: user } = await supabase.from('users').select('otp, upi').eq('id', req.user.id).single();
    if (!user || user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    if (user.upi !== upiId) return res.status(400).json({ error: 'UPI ID mismatch' });

    // Remove UPI and clear OTP
    await supabase.from('users').update({ upi: null, otp: null }).eq('id', req.user.id);

    res.json({ message: 'UPI deleted successfully' });
  } catch (err) {
    console.error('Error deleting UPI with OTP:', err);
    res.status(500).json({ error: 'Failed to delete UPI' });
  }
}; 

exports.getSettings = async (req, res, next) => {
  try {
    // console.log('Fetching settings');

    // Get CPM settings
    const { data: cpmSettings, error: cpmError } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('setting_type', 'cpm')
      .order('pages', { ascending: true });

    if (cpmError) {
      console.error('Error fetching CPM settings:', cpmError);
      return res.status(500).json({ error: 'Failed to fetch CPM settings' });
    }

    // Get general settings
    const { data: generalSettings, error: generalError } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('setting_type', 'general')
      .single();

    if (generalError && generalError.code !== 'PGRST116') {
      console.error('Error fetching general settings:', generalError);
      return res.status(500).json({ error: 'Failed to fetch general settings' });
    }

    // Format CPM settings
    const formattedCpmSettings = cpmSettings.map(setting => ({
      id: setting.id,
      pages: setting.pages,
      cpm: setting.cpm_value || 0,
      multiplier: setting.multiplier || 2,
      description: setting.description || `${setting.pages} page${setting.pages > 1 ? 's' : ''}`
    }));

    res.json({
      cpmSettings: formattedCpmSettings,
      generalSettings: {
        shortLinkDomain: generalSettings?.short_link_domain,
        referralPercentage: parseFloat(generalSettings?.referral_percentage) || 5,
        withdrawalMinimum: parseFloat(generalSettings?.withdrawal_minimum) || 100,
        withdrawalMaximum: parseFloat(generalSettings?.withdrawal_maximum) || 10000
      }
    });
  } catch (err) {
    console.error('Error in getSettings:', err);
    next(err);
  }
};

// Get time-based analytics (hourly and daily)
exports.getTimeBasedAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's links
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('id')
      .eq('user_id', userId);

    if (linksError) {
      console.error('Error fetching links:', linksError);
      return res.status(500).json({ error: 'Failed to fetch links' });
    }

    if (!links || links.length === 0) {
      return res.json({
        hourlyData: Array.from({ length: 24 }, (_, i) => ({
          time: `${i.toString().padStart(2, '0')}:00`,
          clicks: 0,
          earnings: 0
        })),
        dailyData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
          day,
          clicks: 0,
          earnings: 0
        }))
      });
    }

    const linkIds = links.map(link => link.id);

    // Get current date and time in IST
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istNow = new Date(now.getTime() + istOffset);
    
    // Calculate current week boundaries (Sunday to Saturday)
    const currentDay = istNow.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysFromSunday = currentDay === 0 ? 0 : currentDay;
    const weekStart = new Date(istNow);
    weekStart.setDate(istNow.getDate() - daysFromSunday);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Get current day boundaries
    const dayStart = new Date(istNow);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(istNow);
    dayEnd.setHours(23, 59, 59, 999);

    // Fetch link views for the current week
    const { data: weeklyViews, error: weeklyError } = await supabase
      .from('link_views')
      .select('viewed_at, link_id')
      .in('link_id', linkIds)
      .gte('viewed_at', weekStart.toISOString())
      .lte('viewed_at', weekEnd.toISOString());

    if (weeklyError) {
      console.error('Error fetching weekly views:', weeklyError);
      return res.status(500).json({ error: 'Failed to fetch weekly views' });
    }

    // Fetch link views for the current day
    const { data: dailyViews, error: dailyError } = await supabase
      .from('link_views')
      .select('viewed_at, link_id')
      .in('link_id', linkIds)
      .gte('viewed_at', dayStart.toISOString())
      .lte('viewed_at', dayEnd.toISOString());

    if (dailyError) {
      console.error('Error fetching daily views:', dailyError);
      return res.status(500).json({ error: 'Failed to fetch daily views' });
    }

    // Get CPM data for earnings calculation
    const { data: cpmData, error: cpmError } = await supabase
      .from('links')
      .select('id, cpm')
      .in('id', linkIds);

    if (cpmError) {
      console.error('Error fetching CPM data:', cpmError);
      return res.status(500).json({ error: 'Failed to fetch CPM data' });
    }

    const cpmMap = {};
    cpmData.forEach(link => {
      cpmMap[link.id] = link.cpm || 160;
    });

    // Calculate hourly data for current day
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      time: `${i.toString().padStart(2, '0')}:00`,
      clicks: 0,
      earnings: 0
    }));

    dailyViews.forEach(view => {
      const viewDate = new Date(view.viewed_at);
      const hour = viewDate.getHours();
      const cpm = cpmMap[view.link_id] || 160;
      const earnings = cpm / 1000; // CPM / 1000 per view
      
      hourlyData[hour].clicks += 1;
      hourlyData[hour].earnings += earnings;
    });

    // Calculate daily data for current week
    const dailyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => ({
      day,
      clicks: 0,
      earnings: 0
    }));

    weeklyViews.forEach(view => {
      const viewDate = new Date(view.viewed_at);
      const dayOfWeek = viewDate.getDay();
      // Convert Sunday (0) to 6, Monday (1) to 0, etc.
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const cpm = cpmMap[view.link_id] || 160;
      const earnings = cpm / 1000;
      
      dailyData[adjustedDay].clicks += 1;
      dailyData[adjustedDay].earnings += earnings;
    });

    res.json({
      hourlyData,
      dailyData,
      currentWeek: {
        start: weekStart.toISOString().split('T')[0],
        end: weekEnd.toISOString().split('T')[0]
      },
      currentDay: istNow.toISOString().split('T')[0]
    });
  } catch (err) {
    console.error('Error in getTimeBasedAnalytics:', err);
    next(err);
  }
};