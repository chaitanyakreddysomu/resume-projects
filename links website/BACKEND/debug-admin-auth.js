const supabase = require('./utils/supabase');
const jwt = require('jsonwebtoken');

async function debugAdminAuth() {
  try {
    console.log('=== ADMIN AUTH DEBUG ===\n');

    // 1. Check all users in database
    console.log('1. Checking all users in database...');
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email, role, status, createdat')
      .order('createdat', { ascending: false });

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    console.log(`Found ${allUsers.length} users:`);
    allUsers.forEach(user => {
      console.log(`- ${user.firstname} ${user.lastname} (${user.email}) - Role: ${user.role} - Status: ${user.status}`);
    });

    // 2. Check admin users specifically
    console.log('\n2. Checking admin users...');
    const { data: adminUsers, error: adminError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email, role, status')
      .eq('role', 'admin');

    if (adminError) {
      console.error('Error fetching admin users:', adminError);
    } else {
      console.log(`Found ${adminUsers.length} admin users:`);
      adminUsers.forEach(user => {
        console.log(`- ${user.firstname} ${user.lastname} (${user.email}) - Status: ${user.status}`);
      });
    }

    // 3. Test the admin token we generated earlier
    console.log('\n3. Testing admin JWT token...');
    const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ0ZjFiZWNjLWY2Y2ItNDllNS05ZTlkLWIyZDEzMWY0OGM1MiIsImVtYWlsIjoidmlzaG51Y2hhaXR1cmVkZHlAZ21haWwuY29tIiwiaWF0IjoxNzUxNzIwMDUzLCJleHAiOjE3NTE4MDY0NTN9.ywAz9sCP7xIiKGOsTO30y1C_L6Rk2758iRTFgMJ6K4E';

    try {
      const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
      console.log('JWT token decoded successfully:', decoded);
      
      // 4. Check if the user from JWT exists in database
      console.log('\n4. Checking if JWT user exists in database...');
      const { data: jwtUser, error: jwtUserError } = await supabase
        .from('users')
        .select('id, firstname, lastname, email, role, status')
        .eq('id', decoded.id)
        .single();

      if (jwtUserError) {
        console.error('Error fetching JWT user from database:', jwtUserError);
      } else if (jwtUser) {
        console.log('JWT user found in database:', jwtUser);
        console.log(`Role: ${jwtUser.role}, Status: ${jwtUser.status}`);
        
        if (jwtUser.role !== 'admin') {
          console.error('❌ JWT user is not an admin!');
        } else {
          console.log('✅ JWT user is an admin');
        }
      } else {
        console.error('❌ JWT user not found in database!');
      }

    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
    }

    // 5. Test the admin API endpoint directly
    console.log('\n5. Testing admin API endpoint...');
    const response = await fetch('http://localhost:5000/api/admin/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('API Response Status:', response.status);
    const responseText = await response.text();
    console.log('API Response Body:', responseText);

    // 6. Check if there are any users with role = 'admin' but status != 'active'
    console.log('\n6. Checking admin users with non-active status...');
    const { data: inactiveAdmins, error: inactiveError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email, role, status')
      .eq('role', 'admin')
      .neq('status', 'active');

    if (inactiveError) {
      console.error('Error fetching inactive admins:', inactiveError);
    } else {
      console.log(`Found ${inactiveAdmins.length} inactive admin users:`);
      inactiveAdmins.forEach(user => {
        console.log(`- ${user.firstname} ${user.lastname} (${user.email}) - Status: ${user.status}`);
      });
    }

    console.log('\n=== DEBUG COMPLETE ===');

  } catch (error) {
    console.error('Debug failed:', error);
  }
}

debugAdminAuth(); 