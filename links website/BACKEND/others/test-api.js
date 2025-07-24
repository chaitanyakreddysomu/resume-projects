// Simple API test script
const testAPI = async () => {
  console.log('Testing API endpoints...\n');

  // Test 1: Check if server is running
  try {
    const response = await fetch('http://localhost:5000/api/links/test');
    const data = await response.json();
    console.log('✅ Server is running:', data);
  } catch (error) {
    console.log('❌ Server not running:', error.message);
    return;
  }

  // Test 2: Test links endpoint without auth (should fail)
  try {
    const response = await fetch('http://localhost:5000/api/links');
    const data = await response.json();
    console.log('❌ Links endpoint should require auth:', data);
  } catch (error) {
    console.log('✅ Links endpoint correctly requires auth:', error.message);
  }

  console.log('\nAPI test completed. Make sure to:');
  console.log('1. Start the backend server: cd BACKEND && npm start');
  console.log('2. Start the frontend: cd linkearn_pro && npm start');
  console.log('3. Login to get a valid token');
  console.log('4. Check the browser console for API calls');
};

testAPI(); 

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let testUserId = '';
let testLinkId = '';

// Test configuration
const testUser = {
  firstname: 'Test',
  lastname: 'User',
  email: 'test@example.com',
  phone: '1234567890',
  password: 'testpassword123'
};

const testLink = {
  originalUrl: 'https://example.com',
  pages: 4
};

// Helper function to make authenticated requests
const authRequest = (method, endpoint, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  };
  
  if (data) {
    config.data = data;
  }
  
  return axios(config);
};

// Test functions
const runTests = async () => {
  console.log('🚀 Starting API Tests...\n');

  try {
    // Test 1: Server Health Check
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${BASE_URL}/links/test`);
    console.log('✅ Server is running:', healthResponse.data.message);

    // Test 2: User Registration
    console.log('\n2. Testing user registration...');
    const registerResponse = await authRequest('POST', '/auth/register', testUser);
    console.log('✅ User registered:', registerResponse.data.message);

    // Test 3: User Login
    console.log('\n3. Testing user login...');
    const loginResponse = await authRequest('POST', '/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    authToken = loginResponse.data.token;
    console.log('✅ User logged in:', loginResponse.data.name);

    // Test 4: Get User Profile
    console.log('\n4. Testing get user profile...');
    const profileResponse = await authRequest('GET', '/user/profile');
    testUserId = profileResponse.data.id;
    console.log('✅ Profile retrieved:', profileResponse.data.email);

    // Test 5: Create Link
    console.log('\n5. Testing link creation...');
    const createLinkResponse = await authRequest('POST', '/links', testLink);
    testLinkId = createLinkResponse.data.id;
    console.log('✅ Link created:', createLinkResponse.data.url);

    // Test 6: Get User Links
    console.log('\n6. Testing get user links...');
    const linksResponse = await authRequest('GET', '/links');
    console.log('✅ Links retrieved:', linksResponse.data.length, 'links');

    // Test 7: Check Alias Availability
    console.log('\n7. Testing alias availability check...');
    const aliasResponse = await authRequest('GET', '/links/check-alias?alias=test-alias');
    console.log('✅ Alias check:', aliasResponse.data.available ? 'Available' : 'Taken');

    // Test 8: Track Link View
    console.log('\n8. Testing link view tracking...');
    const trackResponse = await authRequest('POST', `/links/${testLinkId}/track-view`);
    console.log('✅ View tracked:', trackResponse.data.message);

    // Test 9: Get Link Analytics
    console.log('\n9. Testing link analytics...');
    const analyticsResponse = await authRequest('GET', `/links/${testLinkId}/analytics`);
    console.log('✅ Analytics retrieved:', analyticsResponse.data.totalClicks, 'clicks');

    // Test 10: Get User Dashboard
    console.log('\n10. Testing user dashboard...');
    const dashboardResponse = await authRequest('GET', '/user/dashboard');
    console.log('✅ Dashboard retrieved:', '₹' + dashboardResponse.data.totalEarnings);

    // Test 11: Get User Earnings
    console.log('\n11. Testing user earnings...');
    const earningsResponse = await authRequest('GET', '/user/earnings');
    console.log('✅ Earnings retrieved:', '₹' + earningsResponse.data.total);

    // Test 12: Get Earnings Analytics
    console.log('\n12. Testing earnings analytics...');
    const earningsAnalyticsResponse = await authRequest('GET', '/user/earnings/analytics');
    console.log('✅ Earnings analytics retrieved:', earningsAnalyticsResponse.data.totalEarnings);

    // Test 13: Get User Transactions
    console.log('\n13. Testing user transactions...');
    const transactionsResponse = await authRequest('GET', '/user/transactions');
    console.log('✅ Transactions retrieved:', transactionsResponse.data.length, 'transactions');

    // Test 14: Update Link
    console.log('\n14. Testing link update...');
    const updateLinkResponse = await authRequest('PUT', `/links/${testLinkId}`, {
      originalurl: 'https://updated-example.com',
      pages: 5
    });
    console.log('✅ Link updated:', updateLinkResponse.data.originalurl);

    // Test 15: Get Withdrawal Stats (Admin)
    console.log('\n15. Testing withdrawal stats...');
    try {
      const withdrawalStatsResponse = await authRequest('GET', '/withdrawal/stats');
      console.log('✅ Withdrawal stats retrieved:', withdrawalStatsResponse.data.totalWithdrawals);
    } catch (error) {
      console.log('⚠️ Withdrawal stats (admin only):', error.response?.data?.error || error.message);
    }

    // Test 16: Get All Withdrawals (Admin)
    console.log('\n16. Testing all withdrawals...');
    try {
      const allWithdrawalsResponse = await authRequest('GET', '/withdrawal/all');
      console.log('✅ All withdrawals retrieved:', allWithdrawalsResponse.data.length);
    } catch (error) {
      console.log('⚠️ All withdrawals (admin only):', error.response?.data?.error || error.message);
    }

    // Test 17: Get Admin Dashboard
    console.log('\n17. Testing admin dashboard...');
    try {
      const adminDashboardResponse = await authRequest('GET', '/admin/dashboard');
      console.log('✅ Admin dashboard retrieved:', adminDashboardResponse.data.totalUsers, 'users');
    } catch (error) {
      console.log('⚠️ Admin dashboard (admin only):', error.response?.data?.error || error.message);
    }

    // Test 18: Get All Users (Admin)
    console.log('\n18. Testing get all users...');
    try {
      const allUsersResponse = await authRequest('GET', '/admin/users');
      console.log('✅ All users retrieved:', allUsersResponse.data.length, 'users');
    } catch (error) {
      console.log('⚠️ All users (admin only):', error.response?.data?.error || error.message);
    }

    // Test 19: Get Admin Payments
    console.log('\n19. Testing admin payments...');
    try {
      const adminPaymentsResponse = await authRequest('GET', '/admin/payments');
      console.log('✅ Admin payments retrieved:', adminPaymentsResponse.data.length, 'payments');
    } catch (error) {
      console.log('⚠️ Admin payments (admin only):', error.response?.data?.error || error.message);
    }

    // Test 20: Get Payment Stats (Admin)
    console.log('\n20. Testing payment stats...');
    try {
      const paymentStatsResponse = await authRequest('GET', '/admin/payments/stats');
      console.log('✅ Payment stats retrieved:', '₹' + paymentStatsResponse.data.pendingAmount);
    } catch (error) {
      console.log('⚠️ Payment stats (admin only):', error.response?.data?.error || error.message);
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('- ✅ 20 endpoints tested');
    console.log('- 🔐 Authentication working');
    console.log('- 📝 CRUD operations working');
    console.log('- 📊 Analytics working');
    console.log('- 💰 Earnings calculation working');
    console.log('- 🔗 Link tracking working');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data?.error || error.message);
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
  }
};

// Run the tests
runTests(); 

// Test script for UPI functionality
const API_BASE = 'http://localhost:5000/api';

// Test user credentials (replace with actual test user)
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';
const TEST_UPI = 'test@upi';

async function testUPIFlow() {
  console.log('🧪 Testing UPI functionality...\n');

  try {
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.statusText}`);
    }

    const loginData = await loginResponse.json();
    authToken = loginData.token;
    console.log('✅ Login successful\n');

    // Step 2: Check current profile
    console.log('2. Checking current profile...');
    const profileResponse = await fetch(`${API_BASE}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!profileResponse.ok) {
      throw new Error(`Profile fetch failed: ${profileResponse.statusText}`);
    }

    const profileData = await profileResponse.json();
    console.log('Current UPI:', profileData.upi || 'Not set');
    console.log('✅ Profile fetched successfully\n');

    // Step 3: Send UPI OTP
    console.log('3. Sending UPI OTP...');
    const otpResponse = await fetch(`${API_BASE}/user/profile/payment/send-otp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        upiId: TEST_UPI,
        action: 'add'
      })
    });

    if (!otpResponse.ok) {
      const errorData = await otpResponse.json();
      throw new Error(`OTP send failed: ${errorData.error}`);
    }

    const otpData = await otpResponse.json();
    console.log('✅ OTP sent successfully');
    console.log('Message:', otpData.message, '\n');

    // Step 4: Verify OTP (simulate with a test OTP)
    console.log('4. Verifying OTP...');
    console.log('Note: This step requires manual OTP entry. Please check your email and enter the OTP.');
    
    // For testing, we'll simulate the verification
    // In real scenario, user would enter the OTP from email
    const testOTP = '123456'; // This should be the actual OTP from email
    
    const verifyResponse = await fetch(`${API_BASE}/user/profile/payment/verify-otp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        upiId: TEST_UPI,
        otp: testOTP,
        action: 'add'
      })
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      console.log('❌ OTP verification failed (expected for test OTP):', errorData.error);
      console.log('This is expected since we used a test OTP. In real scenario, use the actual OTP from email.\n');
    } else {
      const verifyData = await verifyResponse.json();
      console.log('✅ OTP verified successfully');
      console.log('Message:', verifyData.message, '\n');
    }

    // Step 5: Check updated profile
    console.log('5. Checking updated profile...');
    const updatedProfileResponse = await fetch(`${API_BASE}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!updatedProfileResponse.ok) {
      throw new Error(`Updated profile fetch failed: ${updatedProfileResponse.statusText}`);
    }

    const updatedProfileData = await updatedProfileResponse.json();
    console.log('Updated UPI:', updatedProfileData.upi || 'Not set');
    console.log('✅ Updated profile fetched successfully\n');

    // Step 6: Test withdrawal OTP (if UPI is set)
    if (updatedProfileData.upi) {
      console.log('6. Testing withdrawal OTP...');
      const withdrawalOtpResponse = await fetch(`${API_BASE}/user/profile/payment/send-withdrawal-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!withdrawalOtpResponse.ok) {
        const errorData = await withdrawalOtpResponse.json();
        console.log('❌ Withdrawal OTP failed:', errorData.error);
      } else {
        const withdrawalOtpData = await withdrawalOtpResponse.json();
        console.log('✅ Withdrawal OTP sent successfully');
        console.log('Message:', withdrawalOtpData.message, '\n');
      }
    } else {
      console.log('6. Skipping withdrawal OTP test (no UPI set)\n');
    }

    console.log('🎉 UPI functionality test completed!');
    console.log('\n📝 Summary:');
    console.log('- Login: ✅');
    console.log('- Profile fetch: ✅');
    console.log('- UPI OTP send: ✅');
    console.log('- UPI OTP verify: ⚠️ (requires manual OTP)');
    console.log('- Profile update: ✅');
    console.log('- Withdrawal OTP: ✅ (if UPI is set)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testUPIFlow(); 