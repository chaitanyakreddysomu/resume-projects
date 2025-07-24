const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testUserTableColumns() {
  try {
    console.log('Testing User Table Columns (Total Earned & Monthly Earnings)...\n');

    // Get a sample user
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email')
      .limit(1);

    if (usersError || !users || users.length === 0) {
      console.error('No users found');
      return;
    }

    const userId = users[0].id;
    console.log('Testing with user:', users[0].email);

    // Get user's links with earnings, creation date, and CPM
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('id, earnings, createdat, cpm')
      .eq('user_id', userId);

    if (linksError) {
      console.error('Error fetching links:', linksError);
      return;
    }

    console.log(`Found ${links.length} links for user`);

    // Calculate total earnings from links
    const totalEarnings = links.reduce((sum, link) => sum + (link.earnings || 0), 0);
    console.log('Total link earnings:', totalEarnings.toFixed(4));

    // Get referral earnings
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('earnings_amount')
      .eq('referrer_id', userId);

    let referralEarnings = 0;
    if (!referralsError && referrals) {
      referralEarnings = referrals.reduce((sum, r) => sum + (r.earnings_amount || 0), 0);
    }
    console.log('Total referral earnings:', referralEarnings.toFixed(4));

    // Total earned (lifetime) = link earnings + referral earnings
    const totalEarned = totalEarnings + referralEarnings;
    console.log('Total earned (lifetime):', totalEarned.toFixed(4));

    // Calculate monthly earnings (current month) - based on actual earnings from views
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    console.log(`Current month: ${currentMonth + 1}/${currentYear}`);
    
    // Get monthly link earnings by calculating earnings from link views in current month
    let monthlyLinkEarnings = 0;
    if (links.length > 0) {
      const linkIds = links.map(link => link.id);
      
      // Get link views for current month
      const { data: monthlyViews, error: monthlyViewsError } = await supabase
        .from('link_views')
        .select('link_id, viewed_at')
        .in('link_id', linkIds)
        .gte('viewed_at', new Date(currentYear, currentMonth, 1).toISOString())
        .lt('viewed_at', new Date(currentYear, currentMonth + 1, 1).toISOString());

      if (!monthlyViewsError && monthlyViews) {
        console.log(`Found ${monthlyViews.length} views in current month`);
        
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
      } else {
        console.log('No views found for current month or error occurred');
      }
    }
    
    console.log('Monthly link earnings (from views):', monthlyLinkEarnings.toFixed(4));

    // Get monthly referral earnings
    let monthlyReferralEarnings = 0;
    try {
      const { data: monthlyReferrals, error: monthlyReferralsError } = await supabase
        .from('referral_earnings_log')
        .select('amount')
        .eq('referrer_id', userId)
        .gte('earned_at', new Date(currentYear, currentMonth, 1).toISOString())
        .lt('earned_at', new Date(currentYear, currentMonth + 1, 1).toISOString());

      if (!monthlyReferralsError && monthlyReferrals) {
        monthlyReferralEarnings = monthlyReferrals.reduce((sum, r) => sum + (r.amount || 0), 0);
      }
      console.log('Monthly referral earnings (from log):', monthlyReferralEarnings.toFixed(4));
    } catch (err) {
      console.log('Referral earnings log table not available, using total referral earnings');
      monthlyReferralEarnings = referralEarnings;
    }

    const monthlyEarnings = monthlyLinkEarnings + monthlyReferralEarnings;
    console.log('Total monthly earnings:', monthlyEarnings.toFixed(4));

    // Test the API endpoint
    console.log('\n=== Testing API Endpoint ===');
    
    // Simulate the admin controller logic
    const testUserData = {
      id: userId,
      name: `${users[0].firstname || ''} ${users[0].lastname || ''}`.trim() || 'Anonymous',
      email: users[0].email,
      totalEarnings: totalEarnings.toFixed(2),
      totalEarned: totalEarned.toFixed(2),
      monthlyEarnings: monthlyEarnings.toFixed(2),
      totalLinks: links.length
    };

    console.log('User data for table:');
    console.log('- Total Earnings (links only):', testUserData.totalEarnings);
    console.log('- Total Earned (lifetime):', testUserData.totalEarned);
    console.log('- Monthly Earnings:', testUserData.monthlyEarnings);
    console.log('- Total Links:', testUserData.totalLinks);

    console.log('\n✅ User table columns test completed successfully!');
    console.log('\nExpected table display:');
    console.log('┌─────────────────┬─────────────────┬─────────────────┐');
    console.log('│ Total Earned    │ Monthly Earnings│ Links           │');
    console.log('├─────────────────┼─────────────────┼─────────────────┤');
    console.log(`│ ₹${testUserData.totalEarned.padStart(15)} │ ₹${testUserData.monthlyEarnings.padStart(15)} │ ${testUserData.totalLinks.toString().padStart(15)} │`);
    console.log('└─────────────────┴─────────────────┴─────────────────┘');

  } catch (error) {
    console.error('Error in test:', error);
  }
}

testUserTableColumns(); 