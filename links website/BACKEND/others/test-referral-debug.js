const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testReferralSystem() {
  console.log('🔍 Testing Referral System...\n');

  try {
    // 1. Check if the function exists
    console.log('1. Checking if add_referred_user function exists...');
    const { data: functions, error: funcError } = await supabase
      .rpc('add_referred_user', { referrer_id: '00000000-0000-0000-0000-000000000000', new_referred_user_id: '00000000-0000-0000-0000-000000000000' });
    
    if (funcError) {
      console.log('❌ Function does not exist or has error:', funcError.message);
      console.log('📝 You need to run the create-referral-function.sql script in your Supabase SQL editor');
    } else {
      console.log('✅ Function exists and is callable');
    }

    // 2. Check if referred_users column exists
    console.log('\n2. Checking if referred_users column exists...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, referred_users')
      .limit(1);

    if (usersError) {
      console.log('❌ Error accessing users table:', usersError.message);
    } else {
      console.log('✅ referred_users column exists');
      console.log('Sample user data:', users[0]);
    }

    // 3. Check if referrals table exists
    console.log('\n3. Checking if referrals table exists...');
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .limit(1);

    if (referralsError) {
      console.log('❌ Error accessing referrals table:', referralsError.message);
    } else {
      console.log('✅ referrals table exists');
      console.log('Sample referral data:', referrals[0]);
    }

    // 4. Test the complete referral flow
    console.log('\n4. Testing complete referral flow...');
    
    // Create a test referrer
    const testReferrer = {
      firstname: 'Test',
      lastname: 'Referrer',
      email: 'testreferrer@example.com',
      phone: '1234567890',
      password: 'hashedpassword',
      verified: true
    };

    const { data: referrerData, error: referrerError } = await supabase
      .from('users')
      .insert([testReferrer])
      .select()
      .single();

    if (referrerError) {
      console.log('❌ Error creating test referrer:', referrerError.message);
    } else {
      console.log('✅ Test referrer created:', referrerData.id);
      
      // Create a test referred user
      const testReferredUser = {
        firstname: 'Test',
        lastname: 'Referred',
        email: 'testreferred@example.com',
        phone: '0987654321',
        password: 'hashedpassword',
        verified: true,
        referred_by: referrerData.id
      };

      const { data: referredData, error: referredError } = await supabase
        .from('users')
        .insert([testReferredUser])
        .select()
        .single();

      if (referredError) {
        console.log('❌ Error creating test referred user:', referredError.message);
      } else {
        console.log('✅ Test referred user created:', referredData.id);
        
        // Test the function call
        const { error: funcCallError } = await supabase
          .rpc('add_referred_user', {
            referrer_id: referrerData.id,
            new_referred_user_id: referredData.id
          });

        if (funcCallError) {
          console.log('❌ Error calling add_referred_user function:', funcCallError.message);
        } else {
          console.log('✅ Function called successfully');
          
          // Check if the referrer's referred_users array was updated
          const { data: updatedReferrer, error: checkError } = await supabase
            .from('users')
            .select('referred_users')
            .eq('id', referrerData.id)
            .single();

          if (checkError) {
            console.log('❌ Error checking updated referrer:', checkError.message);
          } else {
            console.log('✅ Referrer updated successfully');
            console.log('Referred users array:', updatedReferrer.referred_users);
            
            if (updatedReferrer.referred_users && updatedReferrer.referred_users.includes(referredData.id)) {
              console.log('🎉 SUCCESS: Referral system is working correctly!');
            } else {
              console.log('❌ FAILED: Referred user ID not found in referrer\'s array');
            }
          }
        }
        
        // Clean up test data
        await supabase.from('users').delete().eq('id', referredData.id);
        await supabase.from('users').delete().eq('id', referrerData.id);
        console.log('🧹 Test data cleaned up');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testReferralSystem(); 