const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

// Test user data
const testUser1 = {
  firstname: 'John',
  lastname: 'Referrer',
  email: 'john.referrer@test.com',
  phone: '9876543210',
  password: 'TestPass123!'
};

const testUser2 = {
  firstname: 'Jane',
  lastname: 'Referred',
  email: 'jane.referred@test.com',
  phone: '9876543211',
  password: 'TestPass123!',
  referralCode: '' // Will be set after user1 registration
};

async function testReferralSystem() {
  console.log('🧪 Testing Referral System...\n');

  try {
    // Step 1: Register first user (referrer)
    console.log('1. Registering referrer user...');
    const registerResponse1 = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser1)
    });
    
    if (!registerResponse1.ok) {
      const error = await registerResponse1.json();
      console.log('❌ Referrer registration failed:', error);
      return;
    }
    
    console.log('✅ Referrer registered successfully');
    
    // Step 2: Login as referrer to get user ID
    console.log('\n2. Logging in as referrer...');
    const loginResponse1 = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser1.email,
        password: testUser1.password
      })
    });
    
    if (!loginResponse1.ok) {
      const error = await loginResponse1.json();
      console.log('❌ Referrer login failed:', error);
      return;
    }
    
    const loginData1 = await loginResponse1.json();
    console.log('✅ Referrer logged in successfully');
    
    // Step 3: Get referral info
    console.log('\n3. Getting referral information...');
    const referralInfoResponse = await fetch(`${BASE_URL}/api/auth/referral-info`, {
      headers: {
        'Authorization': `Bearer ${loginData1.token}`
      }
    });
    
    if (referralInfoResponse.ok) {
      const referralInfo = await referralInfoResponse.json();
      console.log('✅ Referral info retrieved:');
      console.log('   - Referral URL:', referralInfo.referralUrl);
      console.log('   - Referred users count:', referralInfo.referredUsersCount);
      console.log('   - Total referral earnings:', referralInfo.totalReferralEarnings);
    } else {
      console.log('❌ Failed to get referral info');
    }
    
    // Step 4: Register second user with referral code
    console.log('\n4. Registering referred user...');
    testUser2.referralCode = loginData1.id; // Use the user ID as referral code
    
    const registerResponse2 = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser2)
    });
    
    if (!registerResponse2.ok) {
      const error = await registerResponse2.json();
      console.log('❌ Referred user registration failed:', error);
      return;
    }
    
    console.log('✅ Referred user registered successfully');
    
    // Step 5: Login as referred user
    console.log('\n5. Logging in as referred user...');
    const loginResponse2 = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser2.email,
        password: testUser2.password
      })
    });
    
    if (!loginResponse2.ok) {
      const error = await loginResponse2.json();
      console.log('❌ Referred user login failed:', error);
      return;
    }
    
    const loginData2 = await loginResponse2.json();
    console.log('✅ Referred user logged in successfully');
    
    // Step 6: Check referral info again for referrer
    console.log('\n6. Checking updated referral information...');
    const updatedReferralInfoResponse = await fetch(`${BASE_URL}/api/auth/referral-info`, {
      headers: {
        'Authorization': `Bearer ${loginData1.token}`
      }
    });
    
    if (updatedReferralInfoResponse.ok) {
      const updatedReferralInfo = await updatedReferralInfoResponse.json();
      console.log('✅ Updated referral info:');
      console.log('   - Referred users count:', updatedReferralInfo.referredUsersCount);
      console.log('   - Referred users:', updatedReferralInfo.referredUsers.map(u => u.name));
    } else {
      console.log('❌ Failed to get updated referral info');
    }
    
    // Step 7: Test referral URL endpoint
    console.log('\n7. Testing referral URL endpoint...');
    const referralUrlResponse = await fetch(`${BASE_URL}/api/auth/referral/${loginData1.id}`);
    
    if (referralUrlResponse.ok) {
      const referralUserInfo = await referralUrlResponse.json();
      console.log('✅ Referral URL endpoint works:');
      console.log('   - Referrer name:', referralUserInfo.name);
      console.log('   - Referrer email:', referralUserInfo.email);
    } else {
      console.log('❌ Referral URL endpoint failed');
    }
    
    console.log('\n🎉 Referral system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testReferralSystem(); 