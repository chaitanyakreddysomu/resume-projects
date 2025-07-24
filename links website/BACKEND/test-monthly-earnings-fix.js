const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testMonthlyEarningsFix() {
  try {
    console.log('Testing monthly earnings calculation fix...\n');

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

    // Get user's links
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('id, earnings, cpm')
      .eq('user_id', userId);

    if (linksError || !links || links.length === 0) {
      console.error('No links found for user');
      return;
    }

    console.log(`Found ${links.length} links`);

    // Calculate current month in IST
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const istNow = new Date(now.getTime() + istOffset);
    const currentMonth = istNow.getMonth();
    const currentYear = istNow.getFullYear();

    console.log('Current IST date:', istNow.toISOString());
    console.log('Current month:', currentMonth + 1, 'Year:', currentYear);

    // Create IST date range for current month
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 1);
    
    // Convert to IST ISO strings
    const monthStartIST = new Date(monthStart.getTime() - istOffset).toISOString();
    const monthEndIST = new Date(monthEnd.getTime() - istOffset).toISOString();

    console.log('Month start (IST):', monthStartIST);
    console.log('Month end (IST):', monthEndIST);

    // Get link views for current month
    const linkIds = links.map(link => link.id);
    const { data: monthlyViews, error: monthlyViewsError } = await supabase
      .from('link_views')
      .select('link_id, viewed_at')
      .in('link_id', linkIds)
      .gte('viewed_at', monthStartIST)
      .lt('viewed_at', monthEndIST);

    if (monthlyViewsError) {
      console.error('Error fetching monthly views:', monthlyViewsError);
      return;
    }

    console.log(`Found ${monthlyViews?.length || 0} views in current month`);

    // Calculate earnings from views in current month
    const cpmMap = {};
    links.forEach(link => {
      cpmMap[link.id] = link.cpm || 160;
    });

    let monthlyLinkEarnings = 0;
    if (monthlyViews) {
      monthlyViews.forEach(view => {
        const cpm = cpmMap[view.link_id] || 160;
        const earnings = cpm / 1000; // CPM / 1000 per view
        monthlyLinkEarnings += earnings;
      });
    }

    console.log('Monthly link earnings:', monthlyLinkEarnings.toFixed(4));

    // Get monthly referral earnings
    const { data: monthlyReferrals, error: monthlyReferralsError } = await supabase
      .from('referral_earnings_log')
      .select('amount, earned_at')
      .eq('referrer_id', userId)
      .gte('earned_at', monthStartIST)
      .lt('earned_at', monthEndIST);

    if (monthlyReferralsError) {
      console.error('Error fetching monthly referrals:', monthlyReferralsError);
    }

    let monthlyReferralEarnings = 0;
    if (monthlyReferrals) {
      monthlyReferralEarnings = monthlyReferrals.reduce((sum, r) => sum + (r.amount || 0), 0);
      console.log(`Found ${monthlyReferrals.length} referral earnings in current month`);
      monthlyReferrals.forEach(ref => {
        console.log(`  - ${ref.amount.toFixed(4)} earned at ${ref.earned_at}`);
      });
    }

    console.log('Monthly referral earnings:', monthlyReferralEarnings.toFixed(4));

    const totalMonthlyEarnings = monthlyLinkEarnings + monthlyReferralEarnings;
    console.log('\nTotal monthly earnings:', totalMonthlyEarnings.toFixed(4));

    // Show some sample views for debugging
    if (monthlyViews && monthlyViews.length > 0) {
      console.log('\nSample views in current month:');
      monthlyViews.slice(0, 5).forEach(view => {
        const cpm = cpmMap[view.link_id] || 160;
        const earnings = cpm / 1000;
        console.log(`  - Link ${view.link_id}: ${earnings.toFixed(4)} (CPM: ${cpm}) at ${view.viewed_at}`);
      });
    }

    console.log('\n✅ Monthly earnings calculation test completed!');

  } catch (error) {
    console.error('Error testing monthly earnings:', error);
  }
}

testMonthlyEarningsFix(); 