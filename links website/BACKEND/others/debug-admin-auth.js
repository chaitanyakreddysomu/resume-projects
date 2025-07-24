const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000';

// Function to get token from cookies
function getTokenFromCookies() {
  // This would work in a browser environment
  // For Node.js, we'll simulate getting it from localStorage or cookies
  console.log('🍪 Getting token from cookies/localStorage...');
  
  // In a real browser environment, you would use:
  // return localStorage.getItem('token') || getCookie('token');
  
  // For this script, we'll prompt the user to paste it
  console.log('   Please paste your token from browser localStorage:');
  console.log('   - Open browser dev tools (F12)');
  console.log('   - Go to Application/Storage tab');
  console.log('   - Find localStorage > your-domain > token');
  console.log('   - Copy the value and paste it when prompted\n');
  
  // In a real implementation, you would return the actual token
  // For now, we'll use a placeholder that the user needs to replace
  return 'PASTE_YOUR_TOKEN_HERE';
}

async function debugAdminAuth() {
  console.log('🔍 Debugging Admin Authentication...\n');

  // Get token from cookies/localStorage
  const token = getTokenFromCookies();

  if (!token || token === 'PASTE_YOUR_TOKEN_HERE') {
    console.log('❌ No valid token found. Please ensure you are logged in and have a valid token.');
    console.log('   You can also manually paste your token in the getTokenFromCookies() function.');
    return;
  }

  // Step 2: Decode JWT token to see what's inside
  console.log('2️⃣ Decoding JWT token...');
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      console.log('   Token payload:', JSON.stringify(payload, null, 2));
      console.log('   User ID:', payload.id);
      console.log('   Email:', payload.email);
      console.log('   Role:', payload.role || 'No role in token');
    } else {
      console.log('   ❌ Invalid JWT token format');
    }
  } catch (error) {
    console.log('   ❌ Error decoding token:', error.message);
  }
  console.log('');

  // Step 3: Test basic auth endpoint
  console.log('3️⃣ Testing basic authentication...');
  try {
    const authResponse = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`   Status: ${authResponse.status}`);
    if (authResponse.ok) {
      const userData = await authResponse.json();
      console.log('   ✅ Auth successful:', JSON.stringify(userData, null, 2));
    } else {
      const errorData = await authResponse.text();
      console.log('   ❌ Auth failed:', errorData);
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }
  console.log('');

  // Step 4: Test admin endpoint
  console.log('4️⃣ Testing admin endpoint...');
  try {
    const adminResponse = await fetch(`${API_URL}/api/admin/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`   Status: ${adminResponse.status}`);
    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      console.log('   ✅ Admin access granted');
    } else {
      const errorData = await adminResponse.text();
      console.log('   ❌ Admin access denied:', errorData);
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }
  console.log('');

  // Step 5: Test withdrawal endpoint
  console.log('5️⃣ Testing withdrawal endpoint...');
  try {
    const withdrawalResponse = await fetch(`${API_URL}/api/withdrawal/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`   Status: ${withdrawalResponse.status}`);
    if (withdrawalResponse.ok) {
      const withdrawalData = await withdrawalResponse.json();
      console.log('   ✅ Withdrawal access granted:', JSON.stringify(withdrawalData, null, 2));
    } else {
      const errorData = await withdrawalResponse.text();
      console.log('   ❌ Withdrawal access denied:', errorData);
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }
  console.log('');

  // Step 6: Check database directly (if you have access)
  console.log('6️⃣ Database Check:');
  console.log('   If you have database access, check:');
  console.log('   - User exists in users table');
  console.log('   - User has role = "admin"');
  console.log('   - User ID matches the token payload');
  console.log('   SQL: SELECT id, email, role FROM users WHERE id = "YOUR_USER_ID"');
}

// Run the debug
debugAdminAuth(); 