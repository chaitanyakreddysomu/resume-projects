const supabase = require('../utils/supabase');
const { getISTISOString, getISTDateString } = require('../utils/dateUtils');

exports.getDashboard = async (req, res, next) => {
  try {
    // console.log('Admin dashboard requested by:', req.user.id);

    // Get total users
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) {
      // console.error('Error fetching users count:', usersError);
      return res.status(500).json({ error: 'Failed to fetch users count' });
    }

    // Get active links
    const { count: activeLinks, error: linksError } = await supabase
      .from('links')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (linksError) {
      // console.error('Error fetching links count:', linksError);
      return res.status(500).json({ error: 'Failed to fetch links count' });
    }

    // Get pending withdrawals (count)
    const { count: pendingWithdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'requested');

    if (withdrawalsError) {
      // console.error('Error fetching withdrawals count:', withdrawalsError);
      return res.status(500).json({ error: 'Failed to fetch withdrawals count' });
    }

    // Calculate total amount to be withdrawn (pending withdrawals)
    const { data: pendingWithdrawalsData, error: pendingAmountError } = await supabase
      .from('withdrawals')
      .select('amount')
      .eq('status', 'requested');

    if (pendingAmountError) {
      // console.error('Error fetching pending withdrawals amounts:', pendingAmountError);
      return res.status(500).json({ error: 'Failed to fetch pending withdrawals amounts' });
    }

    const amountToBeWithdrawn = Array.isArray(pendingWithdrawalsData)
      ? pendingWithdrawalsData.reduce((sum, withdrawal) => sum + (withdrawal.amount || 0), 0)
      : 0;

    // Calculate total revenue (completed withdrawals)
    const { data: completedWithdrawals, error: completedError } = await supabase
      .from('withdrawals')
      .select('amount')
      .eq('status', 'completed');

    if (completedError) {
      // console.error('Error fetching completed withdrawals:', completedError);
      return res.status(500).json({ error: 'Failed to fetch completed withdrawals' });
    }

    // Fix: Handle case when completedWithdrawals or recentActivity is null/undefined
    const revenue = Array.isArray(completedWithdrawals)
      ? completedWithdrawals.reduce((sum, withdrawal) => sum + (withdrawal.amount || 0), 0)
      : 0;

    // Get recent activity (last 10 activities)
    const { data: recentActivity, error: activityError } = await supabase
      .from('withdrawals')
      .select(`
        *,
        users:users!user_id(firstname, lastname, email)
      `)
      .order('date', { ascending: false })
      .limit(10);

    if (activityError) {
      // console.error('Error fetching recent activity:', activityError);
      return res.status(500).json({ error: 'Failed to fetch recent activity' });
    }

    // Fix: Ensure recentActivity is an array before mapping
    const formattedActivity = Array.isArray(recentActivity)
      ? recentActivity.map(activity => ({
          type: 'withdrawal',
          user: activity.users
            ? `${activity.users.firstname || ''} ${activity.users.lastname || ''}`.trim()
            : 'Unknown',
          amount: activity.amount,
          status: activity.status,
          date: activity.date
        }))
      : [];

    // User Growth Trends (monthly for last 12 months)
    const { data: userGrowthRaw, error: userGrowthError } = await supabase
      .from('users')
      .select('id, createdat');

    if (userGrowthError) {
      // console.error('Error fetching user growth:', userGrowthError);
      return res.status(500).json({ error: 'Failed to fetch user growth trends' });
    }

    // Group users by month/year
    const userGrowthTrends = [];
    if (Array.isArray(userGrowthRaw)) {
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        const count = userGrowthRaw.filter(u => {
          const created = new Date(u.createdat);
          return created.getFullYear() === year && created.getMonth() + 1 === month;
        }).length;
        userGrowthTrends.push({ month, year, count });
      }
    }

    // Top Users (by total earned and clicks)
    const { data: usersRaw, error: usersRawError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email');
    if (usersRawError) {
      // console.error('Error fetching users for top users:', usersRawError);
      return res.status(500).json({ error: 'Failed to fetch users for top users' });
    }

    // Get all completed withdrawals
    const { data: allWithdrawals, error: allWithdrawalsError } = await supabase
      .from('withdrawals')
      .select('user_id, amount, status')
      .eq('status', 'completed');
    if (allWithdrawalsError) {
      // console.error('Error fetching withdrawals for top users:', allWithdrawalsError);
      return res.status(500).json({ error: 'Failed to fetch withdrawals for top users' });
    }

    // Get all links
    const { data: allLinks, error: allLinksError } = await supabase
      .from('links')
      .select('id, user_id, url, clicks');
    if (allLinksError) {
      // console.error('Error fetching links for top users/links:', allLinksError);
      return res.status(500).json({ error: 'Failed to fetch links for top users/links' });
    }

    // Calculate top users
    const userStats = usersRaw.map(user => {
      const userWithdrawals = allWithdrawals.filter(w => w.user_id === user.id);
      const totalEarned = userWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
      const userLinks = allLinks.filter(l => l.user_id === user.id);
      const totalClicks = userLinks.reduce((sum, l) => sum + (l.clicks || 0), 0);
      const name = ((user.firstname || '') + ' ' + (user.lastname || '')).trim();
      return {
        id: user.id,
        name,
        email: user.email,
        totalEarned: Number(totalEarned.toFixed(2)),
        totalClicks
      };
    });
    // Sort by totalEarned desc, then totalClicks desc
    const topUsers = userStats.sort((a, b) => b.totalEarned - a.totalEarned || b.totalClicks - a.totalClicks).slice(0, 10);

    // Calculate top links
    const linkStats = allLinks.map(link => {
      // Amount earned for a link = all completed withdrawals for the link's owner
      const ownerWithdrawals = allWithdrawals.filter(w => w.user_id === link.user_id);
      const totalEarned = ownerWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
      return {
        id: link.id,
        title: link.title,
        url: link.url,
        owner: link.user_id,
        totalEarned: Number(totalEarned.toFixed(2)),
        totalClicks: link.clicks || 0
      };
    });
    // Sort by totalEarned desc, then totalClicks desc
    const topLinks = linkStats.sort((a, b) => b.totalEarned - a.totalEarned || b.totalClicks - a.totalClicks).slice(0, 10);

    res.json({
      totalUsers: totalUsers || 0,
      activeLinks: activeLinks || 0,
      pendingWithdrawals: pendingWithdrawals || 0,
      revenue: revenue.toFixed(2),
      serverLoad: 'normal',
      recentActivity: formattedActivity,
      amountToBeWithdrawn: amountToBeWithdrawn.toFixed(2),
      userGrowthTrends,
      topUsers,
      topLinks
    });
  } catch (err) {
    console.error('Error in getDashboard:', err);
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    // console.log('Admin fetching all users');

    // Fetch all users, now also selecting status from db
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        firstname,
        lastname,
        email,
        createdat,
        phone,
        role,
        verified,
        suspend,
        status,
        referred_by,
        referred_users
      `)
      .order('createdat', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    // Check if users array exists and has data
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }

    // For each user, fetch links, link clicks, earnings, and withdrawals
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        // Links
        const { data: links, error: linksError } = await supabase
          .from('links')
          .select('id, earnings, createdat, cpm')
          .eq('user_id', user.id);

        if (linksError) {
          console.error('Error fetching links for user:', user.id, linksError);
        }

        // Total links and earnings
        const totalLinks = links?.length || 0;
        const totalEarnings = links?.reduce((sum, link) => sum + (link.earnings || 0), 0);

        // Get referral earnings
        const { data: referrals, error: referralsError } = await supabase
          .from('referrals')
          .select('earnings_amount')
          .eq('referrer_id', user.id);

        let referralEarnings = 0;
        if (!referralsError && referrals) {
          referralEarnings = referrals.reduce((sum, r) => sum + (r.earnings_amount || 0), 0);
        }

        // Total earned (lifetime) = link earnings + referral earnings
        const totalEarned = totalEarnings + referralEarnings;

        // Get all withdrawals (requested and completed) for available balance calculation
        const { data: userWithdrawals, error: userWithdrawalsError } = await supabase
          .from('withdrawals')
          .select('amount, status, date')
          .eq('user_id', user.id)
          .in('status', ['requested', 'completed'])
          .order('date', { ascending: false });

        if (userWithdrawalsError) {
          console.error('Error fetching withdrawals for user:', user.id, userWithdrawalsError);
        }

        // Calculate pending withdrawals (only requested status)
        const pendingWithdrawals = userWithdrawals
          ? userWithdrawals.filter(w => w.status === 'requested')
              .reduce((sum, withdrawal) => sum + (withdrawal.amount || 0), 0)
          : 0;

        // Calculate total withdrawn amount (completed withdrawals)
        const totalWithdrawn = userWithdrawals
          ? userWithdrawals.filter(w => w.status === 'completed')
              .reduce((sum, withdrawal) => sum + (withdrawal.amount || 0), 0)
          : 0;

        // Find the last completed withdrawal date
        const lastCompletedWithdrawal = userWithdrawals
          ? userWithdrawals.filter(w => w.status === 'completed')
              .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
          : null;

        let availableForWithdraw = 0;
        
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
              .eq('referrer_id', user.id)
              .gt('earned_at', lastWithdrawalDate.toISOString());

            if (!recentReferralsError && recentReferrals) {
              recentReferralEarnings = recentReferrals.reduce((sum, r) => sum + (r.amount || 0), 0);
            }
          } catch (err) {
            console.error('Error fetching recent referral earnings:', err);
            // Fallback to total referral earnings if tracking table doesn't exist
            recentReferralEarnings = referralEarnings;
          }
          
          // Available for withdraw = recent earnings - pending withdrawals
          availableForWithdraw = recentLinkEarnings + recentReferralEarnings - pendingWithdrawals;
        } else {
          // No previous withdrawals, available for withdraw = total earnings - pending withdrawals
          availableForWithdraw = totalEarned - pendingWithdrawals;
        }

        // Ensure available for withdraw is not negative
        availableForWithdraw = Math.max(0, availableForWithdraw);

        // Calculate monthly earnings (current month) - based on actual earnings, not link creation
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
        const istNow = new Date(now.getTime() + istOffset);
        const currentMonth = istNow.getMonth();
        const currentYear = istNow.getFullYear();
        
        // Get monthly link earnings by calculating earnings from link views in current month
        let monthlyLinkEarnings = 0;
        if (links && links.length > 0) {
          const linkIds = links.map(link => link.id);
          
          // Create IST date range for current month
          const monthStart = new Date(currentYear, currentMonth, 1);
          const monthEnd = new Date(currentYear, currentMonth + 1, 1);
          
          // Convert to IST ISO strings
          const monthStartIST = new Date(monthStart.getTime() - istOffset).toISOString();
          const monthEndIST = new Date(monthEnd.getTime() - istOffset).toISOString();
          
          // Get link views for current month
          const { data: monthlyViews, error: monthlyViewsError } = await supabase
            .from('link_views')
            .select('link_id, viewed_at')
            .in('link_id', linkIds)
            .gte('viewed_at', monthStartIST)
            .lt('viewed_at', monthEndIST);

          if (!monthlyViewsError && monthlyViews) {
            // Calculate earnings from views in current month
            const cpmMap = {};
            links.forEach(link => {
              cpmMap[link.id] = link.cpm || 160;
            });

            monthlyViews.forEach(view => {
              const cpm = cpmMap[view.link_id] || 160;
              const earnings = cpm / 1000; // CPM / 1000 per view
              monthlyLinkEarnings += earnings;
            });
          }
        }

        // Get monthly referral earnings
        let monthlyReferralEarnings = 0;
        try {
          // Create IST date range for current month
          const monthStart = new Date(currentYear, currentMonth, 1);
          const monthEnd = new Date(currentYear, currentMonth + 1, 1);
          
          // Convert to IST ISO strings
          const monthStartIST = new Date(monthStart.getTime() - istOffset).toISOString();
          const monthEndIST = new Date(monthEnd.getTime() - istOffset).toISOString();
          
          const { data: monthlyReferrals, error: monthlyReferralsError } = await supabase
            .from('referral_earnings_log')
            .select('amount')
            .eq('referrer_id', user.id)
            .gte('earned_at', monthStartIST)
            .lt('earned_at', monthEndIST);

          if (!monthlyReferralsError && monthlyReferrals) {
            monthlyReferralEarnings = monthlyReferrals.reduce((sum, r) => sum + (r.amount || 0), 0);
          }
        } catch (err) {
          // Fallback to total referral earnings if tracking table doesn't exist
          monthlyReferralEarnings = referralEarnings;
        }

        const monthlyEarnings = monthlyLinkEarnings + monthlyReferralEarnings;

        // Link clicks (from link_views) - only if user has links
        let totalClicks = 0;
        if (links && links.length > 0) {
          const { data: linkViews, error: viewsError } = await supabase
            .from('link_views')
            .select('id')
            .in('link_id', links.map(l => l.id));

          if (viewsError) {
            console.error('Error fetching link views for user:', user.id, viewsError);
          }

          totalClicks = linkViews?.length || 0;
        }

        // Withdraw history
        const { data: userWithdrawalsHistory, error: userWithdrawalsHistoryError } = await supabase
          .from('withdrawals')
          .select('*')
          .eq('user_id', user.id);

        if (userWithdrawalsHistoryError) {
          console.error('Error fetching withdrawals for user:', user.id, userWithdrawalsHistoryError);
        }

        // Use status from db if available, fallback to suspend logic if not
        let status;
        if (typeof user.status === 'string' && user.status.length > 0) {
          status = user.status;
        } else {
          const suspend = typeof user.suspend === 'boolean' ? user.suspend : false;
          status = suspend ? 'suspended' : 'active';
        }

        return {
          id: user.id,
          name: `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Anonymous',
          email: user.email,
          createdat: user.createdat,
          phone: user.phone,
          role: user.role,
          verified: user.verified,
          totalEarnings: totalEarnings.toFixed(2),
          totalEarned: totalEarned.toFixed(2),
          availableForWithdraw: availableForWithdraw.toFixed(2),
          monthlyEarnings: monthlyEarnings.toFixed(2),
          totalLinks,
          totalClicks,
          withdrawHistory: userWithdrawalsHistory || [],
          suspend: typeof user.suspend === 'boolean' ? user.suspend : false,
          status,
          referredBy: user.referred_by,
          referredUsers: user.referred_users || []
        };
      })
    );

    res.json(usersWithDetails);
  } catch (err) {
    console.error('Error in getUsers:', err);
    next(err);
  }
};

exports.getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log('Admin fetching user details for:', id);

    // Get user profile
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        referrer:users!referred_by(id, firstname, lastname, email)
      `)
      .eq('id', id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get referred users details if user has referred users
    let referredUsersDetails = [];
    if (user.referred_users && user.referred_users.length > 0) {
      const { data: referredUsers, error: referredUsersError } = await supabase
        .from('users')
        .select('id, firstname, lastname, email, createdat')
        .in('id', user.referred_users);

      if (!referredUsersError && referredUsers) {
        referredUsersDetails = referredUsers.map(refUser => ({
          id: refUser.id,
          name: `${refUser.firstname || ''} ${refUser.lastname || ''}`.trim() || 'Anonymous',
          email: refUser.email,
          joinedAt: refUser.createdat
        }));
      }
    }

    // Get user's links
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', id)
      .order('createdat', { ascending: false });

    if (linksError) {
      // console.error('Error fetching user links:', linksError);
      return res.status(500).json({ error: 'Failed to fetch user links' });
    }

    // Get user's withdrawals
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', id)
      .order('date', { ascending: false });

    if (withdrawalsError) {
      //  console.error('Error fetching user withdrawals:', withdrawalsError);
      return res.status(500).json({ error: 'Failed to fetch user withdrawals' });
    }

    // Calculate total earnings from links
    const linkEarnings = links.reduce((sum, link) => sum + (link.earnings || 0), 0);

    // Get referral earnings
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('earnings_amount')
      .eq('referrer_id', id);

    let referralEarnings = 0;
    if (!referralsError && referrals) {
      referralEarnings = referrals.reduce((sum, r) => sum + (r.earnings_amount || 0), 0);
    }

    // Total earnings = link earnings + referral earnings
    const totalEarnings = linkEarnings + referralEarnings;

    res.json({
      profile: {
        id: user.id,
        name: `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Anonymous',
        email: user.email,
        phone: user.phone,
        verified: user.verified,
        registered: user.createdat,
        upi: user.upi,
        referredBy: user.referred_by,
        referrer: user.referrer ? {
          id: user.referrer.id,
          name: `${user.referrer.firstname || ''} ${user.referrer.lastname || ''}`.trim() || 'Anonymous',
          email: user.referrer.email
        } : null
      },
      totalEarnings: totalEarnings.toFixed(2),
      linkEarnings: linkEarnings.toFixed(2),
      referralEarnings: referralEarnings.toFixed(2),
      links: links.map(link => ({
        id: link.id,
        url: link.url,
        originalurl: link.originalurl,
        clicks: link.clicks || 0,
        earnings: link.earnings || 0,
        status: link.status,
        createdat: link.createdat,
        expirydate: link.expirydate
      })),
      withdrawals: withdrawals.map(withdrawal => ({
        id: withdrawal.id,
        amount: withdrawal.amount,
        status: withdrawal.status,
        date: withdrawal.date,
        upi: withdrawal.upi
      })),
      referredUsers: referredUsersDetails
    });
  } catch (err) {
    console.error('Error in getUserDetails:', err);
    next(err);
  }
};

exports.suspendUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { suspend, status } = req.body;
    // console.log('Admin suspending user:', id);

    const { data, error } = await supabase
      .from('users')
      .update({ suspend, status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // console.error('Error suspending user:', error);
      return res.status(500).json({ error: 'Failed to suspend user' });
    }

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    // console.log('User suspended successfully:', data.id);
    res.json({ message: 'User suspended successfully', user: data });
  } catch (err) {
    console.error('Error in suspendUser:', err);
    next(err);
  }
};

exports.activateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    // console.log('Admin activating user:', id);

    const { data, error } = await supabase
      .from('users')
      .update({ suspend: false, status: 'active' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // console.error('Error activating user:', error);
      return res.status(500).json({ error: 'Failed to activate user' });
    }

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    // console.log('User activated successfully:', data.id);
    res.json({ message: 'User activated successfully', user: data });
  } catch (err) {
    console.error('Error in activateUser:', err);
    next(err);
  }
};

exports.getPayments = async (req, res, next) => {
  try {
    // console.log('Admin fetching all payments');

    const { data: withdrawals, error } = await supabase
      .from('withdrawals')
      .select(`
        *,
        users!user_id(firstname, lastname, email, upi)
      `)
      .order('date', { ascending: false });

    if (error) {
      // console.error('Error fetching withdrawals:', error);
      return res.status(500).json({ error: 'Failed to fetch withdrawals' });
    }

    const payments = withdrawals.map(withdrawal => ({
      id: withdrawal.id,
      user: `${withdrawal.users.firstname || ''} ${withdrawal.users.lastname || ''}`.trim() || 'Anonymous',
      email: withdrawal.users.email,
      amount: withdrawal.amount,
      upi: withdrawal.upi,
      status: withdrawal.status,
      date: withdrawal.date,
      processed_at: withdrawal.processed_at
    }));

    // console.log('Found payments:', payments.length);
    res.json(payments);
  } catch (err) {
    console.error('Error in getPayments:', err);
    next(err);
  }
};

exports.getPaymentStats = async (req, res, next) => {
  try {
    // console.log('Admin fetching payment statistics');

    // Get all withdrawals
    const { data: withdrawals, error } = await supabase
      .from('withdrawals')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      //  console.error('Error fetching withdrawals:', error);
      return res.status(500).json({ error: 'Failed to fetch withdrawals' });
    }

    // Calculate statistics
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'requested');
    const completedWithdrawals = withdrawals.filter(w => w.status === 'completed');
    const failedWithdrawals = withdrawals.filter(w => w.status === 'failed' || w.status === 'rejected');

    const pendingAmount = pendingWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    const completedAmount = completedWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

    // Calculate today's processed amount
    const today = getISTDateString();
    const todayProcessed = completedWithdrawals
      .filter(w => w.processed_at && w.processed_at.startsWith(today))
      .reduce((sum, w) => sum + (w.amount || 0), 0);

    // Calculate failed transactions
    const failedTransactions = failedWithdrawals.length;

    res.json({
      pendingAmount: pendingAmount.toFixed(2),
      processedToday: todayProcessed.toFixed(2),
      failedTransactions
    });
  } catch (err) {
    console.error('Error in getPaymentStats:', err);
    next(err);
  }
};

exports.checkAdmin = async (req, res, next) => {
  try {
    // console.log('Checking admin role for user:', req.user?.id);
    // console.log('Full user object from JWT:', req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Invalid user token' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, firstname, lastname, email, role')
      .eq('id', req.user.id)
      .single();

    if (error) {
      console.error('Database error in checkAdmin:', error);
      return res.status(500).json({ error: 'Database error while checking admin status' });
    }

    if (!user) {
      console.error('User not found in database:', req.user.id);
      return res.status(404).json({ error: 'User not found in database' });
    }

    // console.log('User found in database:', user);

    if (user.role !== 'admin') {
      console.error('User is not admin:', user.role);
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    // console.log('Admin access granted for user:', req.user.id);
    next();
  } catch (err) {
    console.error('Error in checkAdmin:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserAnalytics = async (req, res) => {
  try {
    // For a specific user, get userId from req.params or req.user.id
    const userId = req.params.id || req.user.id;

    // 1. Withdrawal history
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (withdrawalsError) throw withdrawalsError;

    // 2. Active links
    const { data: activeLinks, error: activeLinksError } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (activeLinksError) throw activeLinksError;

    // 3. Total clicks and 4. Total earnings
    const { data: allLinks, error: allLinksError } = await supabase
      .from('links')
      .select('clicks, earnings')
      .eq('user_id', userId);

    if (allLinksError) throw allLinksError;

    const totalClicks = allLinks.reduce((sum, link) => sum + (link.clicks || 0), 0);
    const totalEarnings = allLinks.reduce((sum, link) => sum + (link.earnings || 0), 0);

    res.json({
      withdrawalHistory: withdrawals,
      activeLinks: activeLinks.length,
      totalClicks,
      totalEarnings
    });
  } catch (err) {
    console.error('Error fetching user analytics:', err);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
};

// ===== WITHDRAWAL MANAGEMENT FUNCTIONS =====

// Get all withdrawals for admin
exports.getAllWithdrawals = async (req, res) => {
  try {
    // console.log('Admin fetching all withdrawals');

    const { data, error } = await supabase
      .from('withdrawals')
      .select(`
        *,
        users!user_id(firstname, lastname, email, upi)
      `)
      .order('date', { ascending: false });

    if (error) {
      // console.error('Error fetching withdrawals:', error);
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
      processed_by: withdrawal.processed_by,
      rejection_reason: withdrawal.rejection_reason,
      user: {
        id: withdrawal.user_id,
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

// Get withdrawal statistics for admin
exports.getWithdrawalStats = async (req, res) => {
  try {
    // console.log('Admin fetching withdrawal statistics');

    // Get all withdrawals
    const { data: withdrawals, error } = await supabase
      .from('withdrawals')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      // console.error('Error fetching withdrawals:', error);
      return res.status(500).json({ error: error.message });
    }

    // Calculate statistics
    const totalWithdrawals = withdrawals.length;
    const totalAmount = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'requested');
    const completedWithdrawals = withdrawals.filter(w => w.status === 'completed');
    const failedWithdrawals = withdrawals.filter(w => w.status === 'failed' || w.status === 'rejected');

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

// Complete withdrawal
exports.completeWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    // console.log('Admin completing withdrawal:', { withdrawalId: id, adminId });

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
      // console.error('Error updating withdrawal:', updateError);
      return res.status(500).json({ error: 'Failed to complete withdrawal' });
    }

    // console.log('Withdrawal completed:', updatedWithdrawal);
    res.json({ 
      message: 'Withdrawal marked as completed',
      withdrawal: updatedWithdrawal
    });
  } catch (err) {
    console.error('Error in completeWithdrawal:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Reject withdrawal
exports.rejectWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    //    console.log('Admin rejecting withdrawal:', { withdrawalId: id, adminId, reason });

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
      // console.error('Error updating withdrawal:', updateError);
      return res.status(500).json({ error: 'Failed to reject withdrawal' });
    }

    // console.log('Withdrawal rejected:', updatedWithdrawal);
    res.json({ 
      message: 'Withdrawal rejected successfully',
      withdrawal: updatedWithdrawal
    });
  } catch (err) {
    console.error('Error in rejectWithdrawal:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get withdrawal by ID
exports.getWithdrawalById = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log('Admin fetching withdrawal details for:', id);

    const { data: withdrawal, error } = await supabase
      .from('withdrawals')
      .select(`
        *,
        users!user_id(firstname, lastname, email, upi, phone)
      `)
      .eq('id', id)
      .single();

    if (error || !withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    const withdrawalWithUser = {
      id: withdrawal.id,
      amount: withdrawal.amount,
      upi: withdrawal.upi,
      status: withdrawal.status,
      date: withdrawal.date,
      processed_at: withdrawal.processed_at,
      processed_by: withdrawal.processed_by,
      rejection_reason: withdrawal.rejection_reason,
      user: {
        id: withdrawal.user_id,
        name: `${withdrawal.users.firstname || ''} ${withdrawal.users.lastname || ''}`.trim(),
        email: withdrawal.users.email,
        phone: withdrawal.users.phone,
        upi: withdrawal.users.upi
      }
    };

    res.json(withdrawalWithUser);
  } catch (err) {
    console.error('Error in getWithdrawalById:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 

exports.getAllLinks = async (req, res) => {
  try {
    // console.log('Admin fetching all links');
    const { data, error } = await supabase
      .from('links')
      .select(`
        id,
        url,
        originalurl,
        user_id,
        clicks,
        earnings,
        status,
        createdat,
        users:users!user_id(firstname, lastname, email)
      `)
      .order('createdat', { ascending: false });

    if (error) {
      //  console.error('Error fetching links:', error);
      return res.status(500).json({ error: 'Failed to fetch links' });
    }

    // Get short link domain from admin settings
    const adminSettingsController = require('./adminSettingsController');
    const SHORT_LINK_DOMAIN = await adminSettingsController.getShortLinkDomain();

    const links = data.map(link => ({
      id: link.id,
      shortUrl: `${SHORT_LINK_DOMAIN.replace(/\/$/, '')}/${link.url}`,
      originalUrl: link.originalurl,
      userName: link.users ? `${link.users.firstname || ''} ${link.users.lastname || ''}`.trim() : '',
      userEmail: link.users ? link.users.email : '',
      user_id: link.user_id,
      clicks: link.clicks || 0,
      earnings: link.earnings || 0,
      status: link.status,
      createdAt: link.createdat
    }));

    res.json(links);
  } catch (err) {
    console.error('Error in getAllLinks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 