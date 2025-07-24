// Simulate frontend admin API calls
// Using built-in fetch (Node.js 18+)

async function testFrontendAdminAPI() {
  try {
    console.log('=== FRONTEND ADMIN API TEST ===\n');

    // Use the valid admin token
    const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ0ZjFiZWNjLWY2Y2ItNDllNS05ZTlkLWIyZDEzMWY0OGM1MiIsImVtYWlsIjoidmlzaG51Y2hhaXR1cmVkZHlAZ21haWwuY29tIiwiaWF0IjoxNzUxNzIwMDUzLCJleHAiOjE3NTE4MDY0NTN9.ywAz9sCP7xIiKGOsTO30y1C_L6Rk2758iRTFgMJ6K4E';

    // Test 1: Admin Users endpoint (same as frontend calls)
    console.log('1. Testing /api/admin/users endpoint...');
    const usersResponse = await fetch('http://localhost:5000/api/admin/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Users Response Status:', usersResponse.status);
    console.log('Users Response Headers:', Object.fromEntries(usersResponse.headers.entries()));

    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log(`✅ Successfully fetched ${usersData.length} users`);
      console.log('First user sample:', usersData[0]);
    } else {
      const errorText = await usersResponse.text();
      console.error('❌ Failed to fetch users:', errorText);
    }

    // Test 2: Admin Dashboard endpoint
    console.log('\n2. Testing /api/admin/dashboard endpoint...');
    const dashboardResponse = await fetch('http://localhost:5000/api/admin/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Dashboard Response Status:', dashboardResponse.status);
    
    if (dashboardResponse.ok) {
      const dashboardData = await dashboardResponse.json();
      console.log('✅ Dashboard data fetched successfully');
      console.log('Dashboard summary:', {
        totalUsers: dashboardData.totalUsers,
        activeLinks: dashboardData.activeLinks,
        pendingWithdrawals: dashboardData.pendingWithdrawals
      });
    } else {
      const errorText = await dashboardResponse.text();
      console.error('❌ Failed to fetch dashboard:', errorText);
    }

    // Test 3: Admin Settings endpoint
    console.log('\n3. Testing /api/admin/settings endpoint...');
    const settingsResponse = await fetch('http://localhost:5000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Settings Response Status:', settingsResponse.status);
    
    if (settingsResponse.ok) {
      const settingsData = await settingsResponse.json();
      console.log('✅ Settings data fetched successfully');
      console.log('Settings summary:', {
        cpmSettingsCount: settingsData.cpmSettings?.length || 0,
        generalSettings: settingsData.generalSettings ? 'Present' : 'Missing'
      });
    } else {
      const errorText = await settingsResponse.text();
      console.error('❌ Failed to fetch settings:', errorText);
    }

    // Test 4: Simulate invalid token
    console.log('\n4. Testing with invalid token...');
    const invalidResponse = await fetch('http://localhost:5000/api/admin/users', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer invalid_token',
        'Content-Type': 'application/json'
      }
    });

    console.log('Invalid Token Response Status:', invalidResponse.status);
    const invalidText = await invalidResponse.text();
    console.log('Invalid Token Response:', invalidText);

    console.log('\n=== FRONTEND TEST COMPLETE ===');

  } catch (error) {
    console.error('Frontend test failed:', error);
  }
}

testFrontendAdminAPI(); 