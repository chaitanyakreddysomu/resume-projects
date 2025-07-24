const supabase = require('../utils/supabase');
const sendMail = require('../utils/mailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getVerificationEmailHtml } = require('../utils/emailTemplates');
const { getForgotPasswordEmailHtml } = require('../utils/forgotPasswordEmailTemplate');
const { getISTISOString } = require('../utils/dateUtils');

exports.register = async (req, res, next) => {
  try {
    // Make phone optional by not requiring it in destructuring
    const { firstname, lastname, email, password, referralCode } = req.body;
    // Accept phone if provided
    const phone = req.body.phone || null;

    const { data: existing } = await supabase.from('users').select().eq('email', email).single();
    if (existing) return res.status(400).json({ error: 'User already exists' });

    // Handle referral code if provided
    let referredBy = null;
    if (referralCode) {
      const { data: referrer } = await supabase
        .from('users')
        .select('id')
        .eq('id', referralCode)
        .single();
      
      if (referrer) {
        referredBy = referrer.id;
      }
    }

    const hashed = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');
    
    // Only include phone if provided
    const userData = {
      firstname,
      lastname,
      email,
      password: hashed,
      verified: false,
      verifyToken: token
    };
    if (phone) {
      userData.phone = phone;
    }

    // Add referral if valid
    if (referredBy) {
      userData.referred_by = referredBy;
    }

    const { data, error } = await supabase.from('users').insert([userData]);
    if (error) {
      console.log('Supabase insert error:', error);
      return res.status(400).json({ error: error.message });
    }

    // If user was referred, create referral record and update referrer's referred_users array
    if (referredBy && data && data[0]) {
      console.log('Processing referral for user:', data[0].id, 'referred by:', referredBy);
      
      try {
        // Create referral record
        const { error: referralError } = await supabase.from('referrals').insert([{
          referrer_id: referredBy,
          referred_user_id: data[0].id,
          earnings_amount: 0,
          total_referred_earnings: 0
        }]);

        if (referralError) {
          console.error('Error creating referral record:', referralError);
        } else {
          console.log('Referral record created successfully');
        }

        // Update referrer's referred_users array
        const { error: functionError } = await supabase.rpc('add_referred_user', {
          referrer_id: referredBy,
          new_referred_user_id: data[0].id
        });

        if (functionError) {
          console.error('Error calling add_referred_user function:', functionError);
          // Fallback: manually update the array
          const { data: currentUser, error: fetchError } = await supabase
            .from('users')
            .select('referred_users')
            .eq('id', referredBy)
            .single();

          if (!fetchError && currentUser) {
            const currentArray = currentUser.referred_users || [];
            const updatedArray = [...currentArray, data[0].id];
            
            const { error: updateError } = await supabase
              .from('users')
              .update({ referred_users: updatedArray })
              .eq('id', referredBy);

            if (updateError) {
              console.error('Error updating referred_users array manually:', updateError);
            } else {
              console.log('Referred_users array updated manually');
            }
          }
        } else {
          console.log('add_referred_user function called successfully');
        }
      } catch (err) {
        console.error('Error in referral processing:', err);
      }
    }

    // Send verification email
    const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const html = getVerificationEmailHtml({
      username: firstname,
      appname: 'Linkearn',
      confirmLink: link
    });
    await sendMail(email, 'Verify your Linkearn account', html);
    res.json({ message: 'Registration successful, check your email for verification.' });
  } catch (err) { next(err); }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { data: user } = await supabase.from('users').select().eq('verifyToken', token).single();
    if (!user) return res.status(400).json({ error: 'Invalid token' });
    await supabase.from('users').update({ verified: true, verifyToken: null }).eq('id', user.id);
    res.json({ message: 'Email verified successfully.' });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { data: user } = await supabase.from('users').select().eq('email', email).single();
    if (!user || !user.verified) return res.status(400).json({ error: 'Invalid credentials or email not verified' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    // If 2FA enabled, send OTP and require verification
    if (user.enable2FA) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await supabase.from('users').update({ otp }).eq('id', user.id);
      await sendMail(user.email, 'Your OTP Code', `<p>Your OTP is <b>${otp}</b></p>`);
      return res.json({ require2FA: true });
    }
    console.log('User found:', user);
    console.log('User ID:', user.id);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role || 'user' }, process.env.JWT_SECRET);
    console.log('Token payload:', jwt.decode(token));
    res.json({
      token,
      role: user.role || 'user',
      name: [user.firstname, user.lastname].filter(Boolean).join(' '),
      email: user.email
    });
  } catch (err) { next(err); }
};

exports.otpVerify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const { data: user } = await supabase.from('users').select().eq('email', email).single();
    if (!user || user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    await supabase.from('users').update({ otp: null }).eq('id', user.id);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role || 'user' }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) { next(err); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const { data: user, error } = await supabase
      .from('users')
      .select('id, firstname, email')
      .eq('email', email)
      .single();

    if (error || !user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
    const resetTokenExpiry = getISTISOString(6 * 60 * 60 * 1000); // 6 hours * 60 minutes * 60 seconds * 1000 milliseconds


    // Save reset token to database
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error saving reset token:', updateError);
      return res.status(500).json({ error: 'Failed to process password reset request' });
    }

    // Send reset email
    const resetLink = `${process.env.FRONTEND_URL}/forgot-password?token=${resetToken}`;
    const html = getForgotPasswordEmailHtml({
      username: user.firstname || 'User',
      appname: 'Linkearn',
      resetLink: resetLink
    });

    await sendMail(user.email, 'Reset Your Linkearn Password', html);

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Find user with valid reset token
    const { data: user, error } = await supabase
      .from('users')
      .select('id, resetToken, resetTokenExpiry')
      .eq('resetToken', token)
      .single();

    if (error || !user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    const now = new Date();
    const expiryTime = new Date(user.resetTokenExpiry);
    console.log('Current time:', now.toISOString());
    console.log('Token expiry time:', expiryTime.toISOString());
    console.log('Is expired:', now > expiryTime);
    
    if (now > expiryTime) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return res.status(500).json({ error: 'Failed to reset password' });
    }

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    console.log('Getting current user for ID:', req.user.id);
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, firstname, lastname, email, role, verified, enable2FA')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Current user data:', user);
    res.json({
      id: user.id,
      name: [user.firstname, user.lastname].filter(Boolean).join(' '),
      email: user.email,
      role: user.role || 'user',
      verified: user.verified,
      enable2FA: user.enable2FA
    });
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    next(err);
  }
};

// Get user's referral information
exports.getReferralInfo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log('Getting referral info for user:', userId);
    
    // Get referral URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const referralUrl = `${frontendUrl}/refer/${userId}`;
    console.log('Referral URL:', referralUrl);
    
    // Get user's referred_users array
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('referred_users')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return res.status(500).json({ error: 'Failed to fetch user data' });
    }

    const referredUserIds = user.referred_users || [];
    console.log('Referred user IDs from array:', referredUserIds);
    
    let referredUsers = [];
    let totalReferralEarnings = 0;
    let totalReferredEarnings = 0;
    
    if (referredUserIds.length > 0) {
      console.log(`Found ${referredUserIds.length} referred users, fetching details...`);
      
      // Get referred users details
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, firstname, lastname, email, createdat')
        .in('id', referredUserIds);

      console.log('Users query result:', { usersCount: users?.length, error: usersError });

      if (usersError) {
        console.error('Error fetching referred users:', usersError);
      } else if (users && users.length > 0) {
        // Get referral earnings for each user
        const { data: referrals, error: referralsError } = await supabase
          .from('referrals')
          .select('referred_user_id, earnings_amount, total_referred_earnings')
          .eq('referrer_id', userId);

        if (referralsError) {
          console.error('Error fetching referrals:', referralsError);
        }

        console.log('Referrals data:', referrals);

        referredUsers = users.map(user => {
          const referral = referrals?.find(r => r.referred_user_id === user.id);
          const earningsFromReferral = referral?.earnings_amount || 0;
          const totalReferredEarningsForUser = referral?.total_referred_earnings || 0;
          
          console.log(`User ${user.id} referral data:`, {
            referral,
            earningsFromReferral,
            totalReferredEarningsForUser
          });
          
          totalReferralEarnings += earningsFromReferral;
          totalReferredEarnings += totalReferredEarningsForUser;
          
          return {
            id: user.id,
            name: [user.firstname, user.lastname].filter(Boolean).join(' ') || 'Anonymous',
            email: user.email,
            joinedAt: user.createdat,
            earningsFromReferral,
            totalReferredEarnings: totalReferredEarningsForUser
          };
        });
        
        console.log(`Processed ${referredUsers.length} referred users`);
      }
    } else {
      console.log('No referred users found in array');
    }

    const responseData = {
      referralUrl,
      referredUsersCount: referredUserIds.length,
      totalReferralEarnings,
      totalReferredEarnings,
      referredUsers
    };

    console.log('Sending response:', responseData);
    res.json(responseData);
  } catch (err) {
    console.error('Error in getReferralInfo:', err);
    next(err);
  }
};

// Get user by referral code (for registration)
exports.getUserByReferralCode = async (req, res, next) => {
  try {
    const { referralCode } = req.params;
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, firstname, lastname, email')
      .eq('id', referralCode)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    res.json({
      id: user.id,
      name: [user.firstname, user.lastname].filter(Boolean).join(' '),
      email: user.email
    });
  } catch (err) {
    console.error('Error in getUserByReferralCode:', err);
    next(err);
  }
}; 