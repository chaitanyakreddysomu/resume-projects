const fetch = require('node-fetch');

async function testAdminSettings() {
  try {
    // Get token from localStorage (you'll need to copy this from browser)
    const token = 'YOUR_ADMIN_TOKEN_HERE'; // Replace with actual token
    
    console.log('Testing admin settings with token:', token.substring(0, 20) + '...');
    
    // Test 1: Check if token is valid
    console.log('\n1. Testing token validity...');
    const authResponse = await fetch('http://localhost:5000/api/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Dashboard response status:', authResponse.status);
    if (authResponse.ok) {
      console.log('✅ Dashboard access successful - token is valid');
    } else {
      const errorText = await authResponse.text();
      console.log('❌ Dashboard access failed:', errorText);
      return;
    }
    
    // Test 2: Try to access settings
    console.log('\n2. Testing admin settings access...');
    const settingsResponse = await fetch('http://localhost:5000/api/admin/settings', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Settings response status:', settingsResponse.status);
    if (settingsResponse.ok) {
      const settingsData = await settingsResponse.json();
      console.log('✅ Settings access successful');
      console.log('Settings data:', JSON.stringify(settingsData, null, 2));
    } else {
      const errorText = await settingsResponse.text();
      console.log('❌ Settings access failed:', errorText);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Instructions for use
console.log('=== Admin Settings Debug Test ===');
console.log('1. Copy your admin token from browser localStorage');
console.log('2. Replace YOUR_ADMIN_TOKEN_HERE with the actual token');
console.log('3. Run this script: node test-admin-settings.js');
console.log('');

testAdminSettings(); 