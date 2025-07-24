// Browser-compatible debug script
// Run this in your browser console (F12 > Console tab)

const API_URL = 'http://localhost:5000';

// Function to get token from localStorage
function getTokenFromLocalStorage() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('❌ No token found in localStorage');
    console.log('   Please make sure you are logged in');
    return null;
  }
  return token;
}

// Function to decode JWT token
function decodeJWT(token) {
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      return payload;
    }
    return null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

async function debugAdminAuth() {
  console.log('🔍 Debugging Admin Authentication...\n');

  // Get token from localStorage
  const token = getTokenFromLocalStorage();
  if (!token) return;

  // Step 1: Decode JWT token
  console.log('1️⃣ Decoding JWT token...');
  const payload = decodeJWT(token);
  if (payload) {
    console.log('   Token payload:', payload);
    console.log('   User ID:', payload.id);
    console.log('   Email:', payload.email);
    console.log('   Role:', payload.role || 'No role in token');
  } else {
    console.log('   ❌ Invalid JWT token format');
    return;
  }
  console.log('');

  // Step 2: Test basic auth endpoint
  console.log('2️⃣ Testing basic authentication...');
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
      console.log('   ✅ Auth successful:', userData);
    } else {
      const errorData = await authResponse.text();
      console.log('   ❌ Auth failed:', errorData);
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }
  console.log('');

  // Step 3: Test admin endpoint
  console.log('3️⃣ Testing admin endpoint...');
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

  // Step 4: Test admin withdrawal endpoint
  console.log('4️⃣ Testing admin withdrawal endpoint...');
  try {
    const withdrawalResponse = await fetch(`${API_URL}/api/admin/withdraw/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`   Status: ${withdrawalResponse.status}`);
    if (withdrawalResponse.ok) {
      const withdrawalData = await withdrawalResponse.json();
      console.log('   ✅ Admin withdrawal access granted:', withdrawalData);
    } else {
      const errorData = await withdrawalResponse.text();
      console.log('   ❌ Admin withdrawal access denied:', errorData);
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }
  console.log('');

  // Step 5: Test admin withdrawal list
  console.log('5️⃣ Testing admin withdrawal list...');
  try {
    const withdrawalListResponse = await fetch(`${API_URL}/api/admin/withdraw`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`   Status: ${withdrawalListResponse.status}`);
    if (withdrawalListResponse.ok) {
      const withdrawalListData = await withdrawalListResponse.json();
      console.log(`   ✅ Admin withdrawal list access granted: ${withdrawalListData.length} withdrawals`);
    } else {
      const errorData = await withdrawalListResponse.text();
      console.log('   ❌ Admin withdrawal list access denied:', errorData);
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }
  console.log('');

  // Step 6: Summary
  console.log('6️⃣ Summary:');
  console.log('   - Token exists:', !!token);
  console.log('   - Token valid:', !!payload);
  console.log('   - User role:', payload?.role || 'No role');
  console.log('   - User ID:', payload?.id);
  console.log('   - Email:', payload?.email);
}

// Run the debug
debugAdminAuth(); 