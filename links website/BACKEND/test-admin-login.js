const supabase = require('./utils/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    
    // Get admin user from database
    const { data: adminUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin')
      .single();
    
    if (userError || !adminUser) {
      console.error('No admin user found:', userError);
      return;
    }
    
    console.log('Admin user found:', {
      id: adminUser.id,
      name: `${adminUser.firstname} ${adminUser.lastname}`,
      email: adminUser.email,
      role: adminUser.role
    });
    
    // Test password (you'll need to know the actual password)
    const testPassword = 'admin123'; // Replace with actual password
    
    const isPasswordValid = await bcrypt.compare(testPassword, adminUser.password);
    
    if (isPasswordValid) {
      console.log('Password is valid!');
      
      // Generate JWT token
      const token = jwt.sign(
        {
          id: adminUser.id,
          email: adminUser.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      console.log('Generated JWT token:', token);
      console.log('Token payload:', jwt.decode(token));
      
      // Test the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Verified token payload:', decoded);
      
    } else {
      console.log('Password is invalid. Please provide correct password.');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAdminLogin(); 