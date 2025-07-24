const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testAdminUsersComplete() {
  try {
    console.log('🧪 Testing Complete Admin Users API\n');

    // 1. Get an admin user first
    console.log('1️⃣ Getting admin user...');
    const { data: adminUsers, error: adminError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email, role')
      .eq('role', 'admin')
      .limit(1);

    if (adminError || !adminUsers || adminUsers.length === 0) {
      console.log('❌ No admin users found');
      return;
    }

    const adminUser = adminUsers[0];
    console.log('✅ Found admin user:', adminUser.email);

    // 2. Test the admin users API endpoint
    console.log('\n2️⃣ Testing Admin Users API Endpoint...');
    
    // Simulate the exact admin controller logic
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
      .order('createdat', { ascending: false })
      .limit(3); // Test with first 3 users

    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }

    console.log(`✅ Found ${users.length} users`);

    // 3. Test earnings calculation for first user
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\n3️⃣ Testing earnings calculation for user: ${testUser.email}`);

      // Get user's links
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('id, earnings, createdat, cpm')
        .eq('user_id', testUser.id);

      if (linksError) {
        console.error('❌ Error fetching links:', linksError);
      } else {
        console.log(`✅ Found ${links?.length || 0} links`);
      }

      // Get referral earnings
      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('earnings_amount')
        .eq('referrer_id', testUser.id);

      if (referralsError) {
        console.error('❌ Error fetching referrals:', referralsError);
      } else {
        console.log(`✅ Found ${referrals?.length || 0} referrals`);
      }

      // Calculate total earnings
      const totalEarnings = links?.reduce((sum, link) => sum + (link.earnings || 0), 0) || 0;
      const referralEarnings = referrals?.reduce((sum, r) => sum + (r.earnings_amount || 0), 0) || 0;
      const totalEarned = totalEarnings + referralEarnings;

      console.log('📊 Earnings Summary:');
      console.log(`   - Link Earnings: ₹${totalEarnings.toFixed(4)}`);
      console.log(`   - Referral Earnings: ₹${referralEarnings.toFixed(4)}`);
      console.log(`   - Total Earned: ₹${totalEarned.toFixed(4)}`);

      // Get withdrawals
      const { data: withdrawals, error: withdrawalsError } = await supabase
        .from('withdrawals')
        .select('amount, status, date')
        .eq('user_id', testUser.id)
        .in('status', ['requested', 'completed'])
        .order('date', { ascending: false });

      if (withdrawalsError) {
        console.error('❌ Error fetching withdrawals:', withdrawalsError);
      } else {
        console.log(`✅ Found ${withdrawals?.length || 0} withdrawals`);
      }

      // Calculate available for withdraw
      const pendingWithdrawals = withdrawals
        ? withdrawals.filter(w => w.status === 'requested')
            .reduce((sum, withdrawal) => sum + (withdrawal.amount || 0), 0)
        : 0;

      const totalWithdrawn = withdrawals
        ? withdrawals.filter(w => w.status === 'completed')
            .reduce((sum, withdrawal) => sum + (withdrawal.amount || 0), 0)
        : 0;

      const lastCompletedWithdrawal = withdrawals
        ? withdrawals.filter(w => w.status === 'completed')
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
        : null;

      let availableForWithdraw = 0;
      
      if (lastCompletedWithdrawal) {
        const lastWithdrawalDate = new Date(lastCompletedWithdrawal.date);
        const recentLinks = links.filter(link => {
          const linkDate = new Date(link.createdat);
          return linkDate > lastWithdrawalDate;
        });
        const recentLinkEarnings = recentLinks.reduce((sum, link) => sum + (link.earnings || 0), 0);
        
        // Get recent referral earnings
        let recentReferralEarnings = 0;
        try {
          const { data: recentReferrals, error: recentReferralsError } = await supabase
            .from('referral_earnings_log')
            .select('amount')
            .eq('referrer_id', testUser.id)
            .gt('earned_at', lastWithdrawalDate.toISOString());

          if (!recentReferralsError && recentReferrals) {
            recentReferralEarnings = recentReferrals.reduce((sum, r) => sum + (r.amount || 0), 0);
          }
        } catch (err) {
          recentReferralEarnings = referralEarnings;
        }
        
        availableForWithdraw = recentLinkEarnings + recentReferralEarnings - pendingWithdrawals;
      } else {
        availableForWithdraw = totalEarned - pendingWithdrawals;
      }

      availableForWithdraw = Math.max(0, availableForWithdraw);

      console.log('💰 Withdrawal Summary:');
      console.log(`   - Pending Withdrawals: ₹${pendingWithdrawals.toFixed(4)}`);
      console.log(`   - Total Withdrawn: ₹${totalWithdrawn.toFixed(4)}`);
      console.log(`   - Available for Withdraw: ₹${availableForWithdraw.toFixed(4)}`);
      console.log(`   - Last Withdrawal: ${lastCompletedWithdrawal?.date || 'None'}`);

      // Calculate monthly earnings
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istNow = new Date(now.getTime() + istOffset);
      const currentMonth = istNow.getMonth();
      const currentYear = istNow.getFullYear();
      
      let monthlyLinkEarnings = 0;
      if (links && links.length > 0) {
        const linkIds = links.map(link => link.id);
        const monthStart = new Date(currentYear, currentMonth, 1);
        const monthEnd = new Date(currentYear, currentMonth + 1, 1);
        const monthStartIST = new Date(monthStart.getTime() - istOffset).toISOString();
        const monthEndIST = new Date(monthEnd.getTime() - istOffset).toISOString();
        
        const { data: monthlyViews, error: monthlyViewsError } = await supabase
          .from('link_views')
          .select('link_id, viewed_at')
          .in('link_id', linkIds)
          .gte('viewed_at', monthStartIST)
          .lt('viewed_at', monthEndIST);

        if (!monthlyViewsError && monthlyViews) {
          const cpmMap = {};
          links.forEach(link => {
            cpmMap[link.id] = link.cpm || 160;
          });

          monthlyViews.forEach(view => {
            const cpm = cpmMap[view.link_id] || 160;
            const earnings = cpm / 1000;
            monthlyLinkEarnings += earnings;
          });
        }
      }

      let monthlyReferralEarnings = 0;
      try {
        const monthStart = new Date(currentYear, currentMonth, 1);
        const monthEnd = new Date(currentYear, currentMonth + 1, 1);
        const monthStartIST = new Date(monthStart.getTime() - istOffset).toISOString();
        const monthEndIST = new Date(monthEnd.getTime() - istOffset).toISOString();
        
        const { data: monthlyReferrals, error: monthlyReferralsError } = await supabase
          .from('referral_earnings_log')
          .select('amount')
          .eq('referrer_id', testUser.id)
          .gte('earned_at', monthStartIST)
          .lt('earned_at', monthEndIST);

        if (!monthlyReferralsError && monthlyReferrals) {
          monthlyReferralEarnings = monthlyReferrals.reduce((sum, r) => sum + (r.amount || 0), 0);
        }
      } catch (err) {
        monthlyReferralEarnings = referralEarnings;
      }

      const monthlyEarnings = monthlyLinkEarnings + monthlyReferralEarnings;

      console.log('📅 Monthly Earnings Summary:');
      console.log(`   - Monthly Link Earnings: ₹${monthlyLinkEarnings.toFixed(4)}`);
      console.log(`   - Monthly Referral Earnings: ₹${monthlyReferralEarnings.toFixed(4)}`);
      console.log(`   - Total Monthly Earnings: ₹${monthlyEarnings.toFixed(4)}`);
    }

    console.log('\n✅ Admin Users API test completed successfully!');
    console.log('\n📋 Expected API Response Structure:');
    console.log('```json');
    console.log('{');
    console.log('  "id": "uuid",');
    console.log('  "name": "User Name",');
    console.log('  "email": "user@example.com",');
    console.log('  "totalEarnings": "1000.00",        // Link earnings only');
    console.log('  "totalEarned": "1200.00",          // Lifetime total (links + referrals)');
    console.log('  "availableForWithdraw": "50.00",   // Available balance after withdrawals');
    console.log('  "monthlyEarnings": "150.00",       // Current month earnings');
    console.log('  "totalLinks": 5,');
    console.log('  "totalClicks": 250,');
    console.log('  "status": "active"');
    console.log('}');
    console.log('```');

  } catch (error) {
    console.error('❌ Error testing admin users API:', error);
  }
}

testAdminUsersComplete(); 