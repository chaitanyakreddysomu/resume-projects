const fetch = require('node-fetch');

async function testAdminLogin() {
  try {
    console.log('=== Testing Admin Login and JWT ===');
    
    // Test admin login
    console.log('\n1. Testing admin login...');
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
    console.log('Response:', JSON.stringify(loginData, null, 2));

    // Decode JWT token
    if (loginData.token) {
      console.log('\n2. Decoding JWT token...');
      const payload = JSON.parse(Buffer.from(loginData.token.split('.')[1], 'base64').toString());
      console.log('JWT Payload:', JSON.stringify(payload, null, 2));
      
      if (payload.role === 'admin') {
        console.log('✅ JWT contains admin role');
      } else {
        console.log('❌ JWT does not contain admin role');
      }
    }

    // Test admin settings access
    if (loginData.token) {
      console.log('\n3. Testing admin settings access...');
      const settingsResponse = await fetch('http://localhost:5000/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        console.log('✅ Admin settings access successful');
        console.log('Settings:', JSON.stringify(settingsData, null, 2));
      } else {
        const errorText = await settingsResponse.text();
        console.error('❌ Admin settings access failed:', settingsResponse.status, errorText);
      }
    }

    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAdminLogin(); 