const fetch = require('node-fetch');

async function testAdminSettingsUpdate() {
  try {
    console.log('=== Testing Admin Settings Update ===');
    
    // First, login as admin to get token
    console.log('\n1. Logging in as admin...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'vishnuchaitureddy@gmail.com',
        password: 'your_admin_password_here' // Replace with actual password
      })
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.error('❌ Login failed:', loginResponse.status, errorText);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    
    if (!loginData.token) {
      console.error('❌ No token received');
      return;
    }

    // Test updating general settings
    console.log('\n2. Testing general settings update...');
    const generalUpdateResponse = await fetch('http://localhost:5000/api/admin/settings/general', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shortLinkDomain: 'test.linkearn.pro',
        referralPercentage: 10,
        withdrawalMinimum: 200,
        withdrawalMaximum: 15000
      })
    });

    if (generalUpdateResponse.ok) {
      console.log('✅ General settings updated successfully');
    } else {
      const errorText = await generalUpdateResponse.text();
      console.error('❌ General settings update failed:', generalUpdateResponse.status, errorText);
    }

    // Test updating CPM settings
    console.log('\n3. Testing CPM settings update...');
    const cpmUpdateResponse = await fetch('http://localhost:5000/api/admin/settings/cpm', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cpmSettings: [
          { pages: 1, cpm: 200, multiplier: 2 },
          { pages: 2, cpm: 400, multiplier: 2 },
          { pages: 3, cpm: 600, multiplier: 2 }
        ]
      })
    });

    if (cpmUpdateResponse.ok) {
      console.log('✅ CPM settings updated successfully');
    } else {
      const errorText = await cpmUpdateResponse.text();
      console.error('❌ CPM settings update failed:', cpmUpdateResponse.status, errorText);
    }

    // Test fetching settings to verify updates
    console.log('\n4. Fetching updated settings...');
    const fetchResponse = await fetch('http://localhost:5000/api/admin/settings', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (fetchResponse.ok) {
      const settings = await fetchResponse.json();
      console.log('✅ Settings fetched successfully');
      console.log('General Settings:', settings.generalSettings);
      console.log('CPM Settings:', settings.cpmSettings);
    } else {
      const errorText = await fetchResponse.text();
      console.error('❌ Settings fetch failed:', fetchResponse.status, errorText);
    }

    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAdminSettingsUpdate(); 