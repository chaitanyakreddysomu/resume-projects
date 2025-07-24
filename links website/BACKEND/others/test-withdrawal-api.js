const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000';
const TEST_TOKEN = 'your-admin-token-here'; // Replace with actual admin token

async function testWithdrawalAPI() {
  console.log('🧪 Testing Withdrawal API Endpoints...\n');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_TOKEN}`
  };

  try {
    // Test 1: Get withdrawal stats
    console.log('1️⃣ Testing GET /api/withdrawal/stats');
    const statsResponse = await fetch(`${API_URL}/api/withdrawal/stats`, {
      method: 'GET',
      headers
    });
    
    console.log(`   Status: ${statsResponse.status}`);
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('   ✅ Success:', JSON.stringify(statsData, null, 2));
    } else {
      const errorData = await statsResponse.text();
      console.log('   ❌ Error:', errorData);
    }
    console.log('');

    // Test 2: Get all withdrawals
    console.log('2️⃣ Testing GET /api/withdrawal/all');
    const allResponse = await fetch(`${API_URL}/api/withdrawal/all`, {
      method: 'GET',
      headers
    });
    
    console.log(`   Status: ${allResponse.status}`);
    if (allResponse.ok) {
      const allData = await allResponse.json();
      console.log(`   ✅ Success: Found ${allData.length} withdrawals`);
      if (allData.length > 0) {
        console.log('   Sample withdrawal:', JSON.stringify(allData[0], null, 2));
      }
    } else {
      const errorData = await allResponse.text();
      console.log('   ❌ Error:', errorData);
    }
    console.log('');

    // Test 3: Test with invalid token
    console.log('3️⃣ Testing with invalid token');
    const invalidResponse = await fetch(`${API_URL}/api/withdrawal/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    console.log(`   Status: ${invalidResponse.status}`);
    if (!invalidResponse.ok) {
      const errorData = await invalidResponse.text();
      console.log('   ✅ Expected error:', errorData);
    }
    console.log('');

    // Test 4: Test without token
    console.log('4️⃣ Testing without token');
    const noTokenResponse = await fetch(`${API_URL}/api/withdrawal/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`   Status: ${noTokenResponse.status}`);
    if (!noTokenResponse.ok) {
      const errorData = await noTokenResponse.text();
      console.log('   ✅ Expected error:', errorData);
    }

  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

// Run the test
testWithdrawalAPI(); 