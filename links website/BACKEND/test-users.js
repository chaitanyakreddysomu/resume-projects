const supabase = require('./utils/supabase');

async function testUsers() {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Check if users table exists and has data
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email, role')
      .limit(5);
    
    console.log('Users found:', users?.length || 0);
    if (usersError) {
      console.error('Error fetching users:', usersError);
    } else if (users && users.length > 0) {
      console.log('Sample users:', users);
    }
    
    // Test 2: Check for admin users specifically
    const { data: admins, error: adminsError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email, role')
      .eq('role', 'admin');
    
    console.log('Admin users found:', admins?.length || 0);
    if (adminsError) {
      console.error('Error fetching admins:', adminsError);
    } else if (admins && admins.length > 0) {
      console.log('Admin users:', admins);
    }
    
    // Test 3: Check table structure
    console.log('\nChecking table structure...');
    const { data: structure, error: structureError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (structureError) {
      console.error('Error checking structure:', structureError);
    } else if (structure && structure.length > 0) {
      console.log('Table columns:', Object.keys(structure[0]));
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testUsers(); 