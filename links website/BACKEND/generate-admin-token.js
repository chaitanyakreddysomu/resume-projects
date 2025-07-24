const supabase = require('./utils/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function generateAdminToken() {
  try {
    console.log('Generating admin token...');
    
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
    
    // Try common passwords or generate a new one
    const passwordsToTry = ['admin123', 'password', '123456', 'admin'];
    
    let validPassword = null;
    for (const password of passwordsToTry) {
      try {
        const isPasswordValid = await bcrypt.compare(password, adminUser.password);
        if (isPasswordValid) {
          validPassword = password;
          console.log('Valid password found:', password);
          break;
        }
      } catch (error) {
        console.log('Password check failed for:', password);
      }
    }
    
    if (!validPassword) {
      console.log('No valid password found. Creating new admin password...');
      
      // Generate a new password and hash it
      const newPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update admin user password
      const { error: updateError } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('id', adminUser.id);
      
      if (updateError) {
        console.error('Failed to update password:', updateError);
        return;
      }
      
      console.log('New admin password set:', newPassword);
      validPassword = newPassword;
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        id: adminUser.id,
        email: adminUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('\n=== ADMIN TOKEN GENERATED ===');
    console.log('Token:', token);
    console.log('User ID:', adminUser.id);
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);
    console.log('=============================\n');
    
    // Test the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verification successful:', decoded);
    
    return token;
    
  } catch (error) {
    console.error('Token generation failed:', error);
  }
}

generateAdminToken(); 