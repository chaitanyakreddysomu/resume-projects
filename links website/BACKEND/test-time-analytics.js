const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testTimeBasedAnalytics() {
  try {
    console.log('Testing Time-Based Analytics API...\n');

    // Get current date and time in IST
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istNow = new Date(now.getTime() + istOffset);
    
    console.log('Current IST time:', istNow.toISOString());
    console.log('Current day of week:', istNow.getDay()); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate current week boundaries (Sunday to Saturday)
    const currentDay = istNow.getDay();
    const daysFromSunday = currentDay === 0 ? 0 : currentDay;
    const weekStart = new Date(istNow);
    weekStart.setDate(istNow.getDate() - daysFromSunday);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    console.log('Week start (Sunday):', weekStart.toISOString());
    console.log('Week end (Saturday):', weekEnd.toISOString());

    // Get current day boundaries
    const dayStart = new Date(istNow);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(istNow);
    dayEnd.setHours(23, 59, 59, 999);

    console.log('Day start:', dayStart.toISOString());
    console.log('Day end:', dayEnd.toISOString());

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
    console.log('\nTesting with user:', users[0].email);

    // Get user's links
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('id, url, cpm')
      .eq('user_id', userId);

    if (linksError) {
      console.error('Error fetching links:', linksError);
      return;
    }

    console.log(`Found ${links.length} links for user`);

    if (links.length === 0) {
      console.log('No links found, returning empty data');
      return;
    }

    const linkIds = links.map(link => link.id);

    // Fetch link views for the current week
    const { data: weeklyViews, error: weeklyError } = await supabase
      .from('link_views')
      .select('viewed_at, link_id')
      .in('link_id', linkIds)
      .gte('viewed_at', weekStart.toISOString())
      .lte('viewed_at', weekEnd.toISOString());

    if (weeklyError) {
      console.error('Error fetching weekly views:', weeklyError);
      return;
    }

    console.log(`Found ${weeklyViews.length} views for current week`);

    // Fetch link views for the current day
    const { data: dailyViews, error: dailyError } = await supabase
      .from('link_views')
      .select('viewed_at, link_id')
      .in('link_id', linkIds)
      .gte('viewed_at', dayStart.toISOString())
      .lte('viewed_at', dayEnd.toISOString());

    if (dailyError) {
      console.error('Error fetching daily views:', dailyError);
      return;
    }

    console.log(`Found ${dailyViews.length} views for current day`);

    // Create CPM map
    const cpmMap = {};
    links.forEach(link => {
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
      const earnings = cpm / 1000;
      
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
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const cpm = cpmMap[view.link_id] || 160;
      const earnings = cpm / 1000;
      
      dailyData[adjustedDay].clicks += 1;
      dailyData[adjustedDay].earnings += earnings;
    });

    console.log('\n=== HOURLY DATA (Current Day) ===');
    hourlyData.forEach(hour => {
      if (hour.clicks > 0) {
        console.log(`${hour.time}: ${hour.clicks} clicks, ₹${hour.earnings.toFixed(4)}`);
      }
    });

    console.log('\n=== DAILY DATA (Current Week) ===');
    dailyData.forEach(day => {
      if (day.clicks > 0) {
        console.log(`${day.day}: ${day.clicks} clicks, ₹${day.earnings.toFixed(4)}`);
      }
    });

    console.log('\n✅ Time-based analytics test completed successfully!');

  } catch (error) {
    console.error('Error in test:', error);
  }
}

testTimeBasedAnalytics(); 