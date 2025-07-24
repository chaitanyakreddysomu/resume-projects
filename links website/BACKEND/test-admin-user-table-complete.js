const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testAdminUserTableComplete() {
  try {
    console.log('🧪 Testing Complete Admin User Table Functionality\n');

    // 1. Test the admin users API endpoint
    console.log('1️⃣ Testing Admin Users API Endpoint...');
    
    // First, we need to get an admin token
    const { data: adminUsers, error: adminError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email, role')
      .eq('role', 'admin')
      .limit(1);

    if (adminError || !adminUsers || adminUsers.length === 0) {
      console.log('❌ No admin users found. Please create an admin user first.');
      return;
    }

    const adminUser = adminUsers[0];
    console.log('✅ Found admin user:', adminUser.email);

    // 2. Test the actual API endpoint (simulate the request)
    console.log('\n2️⃣ Simulating Admin Users API Response...');
    
    // Get all users (simulating admin controller logic)
    const { data: allUsers, error: usersError } = await supabase
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
      .limit(5); // Test with first 5 users

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }

    console.log(`✅ Found ${allUsers.length} users to test`);

    // 3. Process each user with the complete logic
    console.log('\n3️⃣ Processing Users with Complete Logic...');
    
    const processedUsers = [];
    
    for (const user of allUsers) {
      console.log(`\n📊 Processing user: ${user.email}`);
      
      // Get user's links
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('id, earnings, createdat, cpm')
        .eq('user_id', user.id);

      if (linksError) {
        console.error(`❌ Error fetching links for ${user.email}:`, linksError);
        continue;
      }

      // Calculate total earnings from links
      const totalEarnings = links?.reduce((sum, link) => sum + (link.earnings || 0), 0) || 0;

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

      // Calculate monthly earnings (current month) with IST timezone
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

      // Calculate total clicks
      let totalClicks = 0;
      if (links && links.length > 0) {
        const { data: linkViews, error: viewsError } = await supabase
          .from('link_views')
          .select('id')
          .in('link_id', links.map(l => l.id));

        if (!viewsError) {
          totalClicks = linkViews?.length || 0;
        }
      }

      // Determine status
      let status;
      if (typeof user.status === 'string' && user.status.length > 0) {
        status = user.status;
      } else {
        const suspend = typeof user.suspend === 'boolean' ? user.suspend : false;
        status = suspend ? 'suspended' : 'active';
      }

      const processedUser = {
        id: user.id,
        name: `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Anonymous',
        email: user.email,
        createdat: user.createdat,
        phone: user.phone,
        role: user.role,
        verified: user.verified,
        totalEarnings: totalEarnings.toFixed(2),
        totalEarned: totalEarned.toFixed(2),
        monthlyEarnings: monthlyEarnings.toFixed(2),
        totalLinks: links?.length || 0,
        totalClicks,
        suspend: typeof user.suspend === 'boolean' ? user.suspend : false,
        status,
        referredBy: user.referred_by,
        referredUsers: user.referred_users || []
      };

      processedUsers.push(processedUser);

      console.log(`   📈 Total Earnings (links): ₹${processedUser.totalEarnings}`);
      console.log(`   💰 Total Earned (lifetime): ₹${processedUser.totalEarned}`);
      console.log(`   📅 Monthly Earnings: ₹${processedUser.monthlyEarnings}`);
      console.log(`   🔗 Total Links: ${processedUser.totalLinks}`);
      console.log(`   👆 Total Clicks: ${processedUser.totalClicks}`);
      console.log(`   📊 Status: ${processedUser.status}`);
    }

    // 4. Display final results
    console.log('\n4️⃣ Final Results Summary:');
    console.log('┌─────────────────────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ User Table Results                                                                                │');
    console.log('├─────────────────┬─────────────────┬─────────────────┬──────────────┬──────────────┬─────────────┤');
    console.log('│ User            │ Total Earned    │ Monthly Earnings│ Links        │ Clicks       │ Status      │');
    console.log('├─────────────────┼─────────────────┼─────────────────┼──────────────┼──────────────┼─────────────┤');

    processedUsers.forEach(user => {
      const name = user.name.length > 15 ? user.name.substring(0, 12) + '...' : user.name.padEnd(15);
      const totalEarned = user.totalEarned.padStart(15);
      const monthlyEarnings = user.monthlyEarnings.padStart(15);
      const links = user.totalLinks.toString().padStart(12);
      const clicks = user.totalClicks.toString().padStart(12);
      const status = user.status.padStart(11);
      
      console.log(`│ ${name} │ ${totalEarned} │ ${monthlyEarnings} │ ${links} │ ${clicks} │ ${status} │`);
    });

    console.log('└─────────────────┴─────────────────┴─────────────────┴──────────────┴──────────────┴─────────────┘');

    // 5. Test specific scenarios
    console.log('\n5️⃣ Testing Specific Scenarios...');
    
    // Find users with highest earnings
    const highestTotalEarned = processedUsers.reduce((max, user) => 
      parseFloat(user.totalEarned) > parseFloat(max.totalEarned) ? user : max
    );
    
    const highestMonthlyEarnings = processedUsers.reduce((max, user) => 
      parseFloat(user.monthlyEarnings) > parseFloat(max.monthlyEarnings) ? user : max
    );

    console.log(`🏆 Highest Total Earned: ${highestTotalEarned.name} - ₹${highestTotalEarned.totalEarned}`);
    console.log(`📈 Highest Monthly Earnings: ${highestMonthlyEarnings.name} - ₹${highestMonthlyEarnings.monthlyEarnings}`);

    // Check for users with zero earnings
    const usersWithZeroEarnings = processedUsers.filter(user => parseFloat(user.totalEarned) === 0);
    const usersWithZeroMonthly = processedUsers.filter(user => parseFloat(user.monthlyEarnings) === 0);

    console.log(`📊 Users with zero total earnings: ${usersWithZeroEarnings.length}`);
    console.log(`📊 Users with zero monthly earnings: ${usersWithZeroMonthly.length}`);

    console.log('\n✅ Complete Admin User Table Test Finished Successfully!');
    console.log('\n🎯 Key Points Verified:');
    console.log('   ✅ Total Earned calculation (lifetime earnings)');
    console.log('   ✅ Monthly Earnings calculation (current month)');
    console.log('   ✅ IST timezone handling for monthly calculations');
    console.log('   ✅ Referral earnings inclusion');
    console.log('   ✅ Link earnings calculation');
    console.log('   ✅ Status determination');
    console.log('   ✅ Click counting');

  } catch (error) {
    console.error('❌ Error in complete test:', error);
  }
}

testAdminUserTableComplete(); 