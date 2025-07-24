const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testMonthlyEarningsAPI() {
  try {
    console.log('Testing Monthly Earnings API...\n');

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

    // Get user's links with CPM
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('id, earnings, cpm')
      .eq('user_id', userId);

    if (linksError) {
      console.error('Error fetching links:', linksError);
      return;
    }

    console.log(`Found ${links.length} links for user`);

    // Calculate current month boundaries
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    console.log(`Current month: ${currentMonth + 1}/${currentYear}`);

    // Get link views for current month
    let monthlyViews = [];
    if (links.length > 0) {
      const linkIds = links.map(link => link.id);
      
      const { data: views, error: viewsError } = await supabase
        .from('link_views')
        .select('link_id, viewed_at')
        .in('link_id', linkIds)
        .gte('viewed_at', new Date(currentYear, currentMonth, 1).toISOString())
        .lt('viewed_at', new Date(currentYear, currentMonth + 1, 1).toISOString());

      if (!viewsError && views) {
        monthlyViews = views;
        console.log(`Found ${views.length} views in current month`);
      } else {
        console.log('No views found for current month');
      }
    }

    // Calculate monthly earnings manually
    let monthlyEarnings = 0;
    const cpmMap = {};
    links.forEach(link => {
      cpmMap[link.id] = link.cpm || 160;
    });

    monthlyViews.forEach(view => {
      const cpm = cpmMap[view.link_id] || 160;
      const earnings = cpm / 1000;
      monthlyEarnings += earnings;
    });

    console.log('Manual calculation - Monthly earnings:', monthlyEarnings.toFixed(4));

    // Test the actual API endpoint (simulate admin controller logic)
    console.log('\n=== Simulating Admin Controller Logic ===');
    
    // Simulate the exact logic from adminController.js
    let monthlyLinkEarnings = 0;
    if (links && links.length > 0) {
      const linkIds = links.map(link => link.id);
      
      const { data: monthlyViewsAPI, error: monthlyViewsError } = await supabase
        .from('link_views')
        .select('link_id, viewed_at')
        .in('link_id', linkIds)
        .gte('viewed_at', new Date(currentYear, currentMonth, 1).toISOString())
        .lt('viewed_at', new Date(currentYear, currentMonth + 1, 1).toISOString());

      if (!monthlyViewsError && monthlyViewsAPI) {
        monthlyViewsAPI.forEach(view => {
          const cpm = cpmMap[view.link_id] || 160;
          const earnings = cpm / 1000;
          monthlyLinkEarnings += earnings;
        });
      }
    }

    console.log('API calculation - Monthly link earnings:', monthlyLinkEarnings.toFixed(4));

    // Get referral earnings for comparison
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('earnings_amount')
      .eq('referrer_id', userId);

    let referralEarnings = 0;
    if (!referralsError && referrals) {
      referralEarnings = referrals.reduce((sum, r) => sum + (r.earnings_amount || 0), 0);
    }

    console.log('Total referral earnings:', referralEarnings.toFixed(4));

    // Total earned calculation
    const totalEarnings = links.reduce((sum, link) => sum + (link.earnings || 0), 0);
    const totalEarned = totalEarnings + referralEarnings;

    console.log('\n=== Final Results ===');
    console.log('Total Earnings (links only):', totalEarnings.toFixed(4));
    console.log('Total Earned (lifetime):', totalEarned.toFixed(4));
    console.log('Monthly Earnings:', monthlyLinkEarnings.toFixed(4));

    console.log('\n✅ Monthly earnings API test completed successfully!');

  } catch (error) {
    console.error('Error in test:', error);
  }
}

testMonthlyEarningsAPI(); 