const supabase = require('./utils/supabase');

async function testAdminRole() {
  try {
    console.log('=== Testing Admin Role ===');
    
    // 1. Check if admin user exists
    console.log('\n1. Checking for admin user...');
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('id, email, firstname, lastname, role')
      .eq('role', 'admin')
      .single();

    if (adminError) {
      console.error('❌ Error finding admin user:', adminError);
      return;
    }

    if (!adminUser) {
      console.log('❌ No admin user found in database');
      console.log('Creating admin user...');
      
      // Create admin user
      const { data: newAdmin, error: createError } = await supabase
        .from('users')
        .insert({
          email: 'admin@linkearn.pro',
          firstname: 'Admin',
          lastname: 'User',
          role: 'admin',
          verified: true,
          password: '$2b$10$dummy.hash.for.admin.user'
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating admin user:', createError);
        return;
      }

      console.log('✅ Admin user created:', newAdmin);
    } else {
      console.log('✅ Admin user found:', adminUser);
    }

    // 2. Check all users and their roles
    console.log('\n2. Checking all users and their roles...');
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id, email, firstname, lastname, role')
      .order('createdat', { ascending: false })
      .limit(10);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }

    console.log('Recent users:');
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.firstname} ${user.lastname}) - Role: ${user.role || 'user'}`);
    });

    // 3. Test admin settings access
    console.log('\n3. Testing admin settings table...');
    const { data: settings, error: settingsError } = await supabase
      .from('admin_settings')
      .select('*')
      .limit(5);

    if (settingsError) {
      console.error('❌ Error accessing admin_settings:', settingsError);
    } else {
      console.log('✅ Admin settings table accessible');
      console.log(`Found ${settings.length} settings records`);
    }

    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAdminRole(); 