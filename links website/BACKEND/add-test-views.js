const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function addTestViews() {
  try {
    console.log('Adding test link views...\n');

    // Get a sample user and their links
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email')
      .limit(1);

    if (usersError || !users || users.length === 0) {
      console.error('No users found');
      return;
    }

    const userId = users[0].id;
    console.log('Using user:', users[0].email);

    // Get user's links
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('id, url')
      .eq('user_id', userId);

    if (linksError || !links || links.length === 0) {
      console.error('No links found for user');
      return;
    }

    console.log(`Found ${links.length} links`);

    // Get current date and time in IST
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);
    
    // Calculate current week boundaries
    const currentDay = istNow.getDay();
    const daysFromSunday = currentDay === 0 ? 0 : currentDay;
    const weekStart = new Date(istNow);
    weekStart.setDate(istNow.getDate() - daysFromSunday);
    weekStart.setHours(0, 0, 0, 0);

    // Add test views for the current week
    const testViews = [];
    const linkIds = links.map(link => link.id);

    // Add views for each day of the current week
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + day);
      
      // Skip future days
      if (currentDate > istNow) continue;

      // Add 5-15 views per day at different hours
      const viewsPerDay = Math.floor(Math.random() * 10) + 5;
      
      for (let i = 0; i < viewsPerDay; i++) {
        const viewTime = new Date(currentDate);
        viewTime.setHours(Math.floor(Math.random() * 24));
        viewTime.setMinutes(Math.floor(Math.random() * 60));
        viewTime.setSeconds(Math.floor(Math.random() * 60));
        
        // Skip future times
        if (viewTime > istNow) continue;

        const randomLinkId = linkIds[Math.floor(Math.random() * linkIds.length)];
        const randomIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        const randomUserAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/${Math.floor(Math.random() * 1000)}.${Math.floor(Math.random() * 100)}`;

        testViews.push({
          link_id: randomLinkId,
          user_agent: randomUserAgent,
          ip_address: randomIP,
          viewed_at: viewTime.toISOString()
        });
      }
    }

    console.log(`Adding ${testViews.length} test views...`);

    // Insert test views in batches
    const batchSize = 50;
    for (let i = 0; i < testViews.length; i += batchSize) {
      const batch = testViews.slice(i, i + batchSize);
      const { error } = await supabase
        .from('link_views')
        .insert(batch);

      if (error) {
        console.error('Error inserting batch:', error);
      } else {
        console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}`);
      }
    }

    console.log('\n✅ Test views added successfully!');
    console.log(`Added ${testViews.length} views across the current week`);

  } catch (error) {
    console.error('Error adding test views:', error);
  }
}

addTestViews(); 