const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestReferrals() {
  console.log('=== Creating Test Referral Data ===\n');

  try {
    // 1. First, get some existing users
    console.log('1. Getting existing users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email')
      .limit(5);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    console.log('Found users:', users?.length || 0);
    if (!users || users.length < 2) {
      console.log('Need at least 2 users to create referrals');
      return;
    }

    // 2. Create referral relationships
    console.log('\n2. Creating referral relationships...');
    
    // Make the first user refer the second user
    const referrerId = users[0].id;
    const referredUserId = users[1].id;

    console.log(`Making ${users[0].firstname} refer ${users[1].firstname}`);

    // Update the referred user to have a referrer
    const { error: updateError } = await supabase
      .from('users')
      .update({ referred_by: referrerId })
      .eq('id', referredUserId);

    if (updateError) {
      console.error('Error updating user with referrer:', updateError);
      return;
    }

    // Create referral record
    const { data: referralData, error: referralError } = await supabase
      .from('referrals')
      .insert([{
        referrer_id: referrerId,
        referred_user_id: referredUserId,
        earnings_amount: 25.50, // Some test earnings
        total_referred_earnings: 510.00 // 5% of some earnings
      }])
      .select();

    if (referralError) {
      console.error('Error creating referral:', referralError);
      return;
    }

    console.log('Created referral:', referralData);

    // 3. Test the referral info API
    console.log('\n3. Testing referral info...');
    const { data: testReferrals, error: testError } = await supabase
      .from('referrals')
      .select(`
        referred_user_id,
        earnings_amount,
        total_referred_earnings,
        referred:users!referred_user_id(firstname, lastname, email, createdat)
      `)
      .eq('referrer_id', referrerId);

    if (testError) {
      console.error('Error testing referrals:', testError);
      return;
    }

    console.log('Test referrals found:', testReferrals);

    // 4. Format the data like the API would
    const referredUsers = testReferrals.map(ref => ({
      id: ref.referred_user_id,
      name: [ref.referred.firstname, ref.referred.lastname].filter(Boolean).join(' '),
      email: ref.referred.email,
      joinedAt: ref.referred.createdat,
      earningsFromReferral: ref.earnings_amount || 0,
      totalReferredEarnings: ref.total_referred_earnings || 0
    }));

    const totalReferralEarnings = testReferrals.reduce((sum, r) => sum + (r.earnings_amount || 0), 0);
    const totalReferredEarnings = testReferrals.reduce((sum, r) => sum + (r.total_referred_earnings || 0), 0);

    const apiResponse = {
      referralUrl: `http://localhost:3000/refer/${referrerId}`,
      referredUsersCount: testReferrals.length,
      totalReferralEarnings,
      totalReferredEarnings,
      referredUsers
    };

    console.log('\n4. API Response format:');
    console.log(JSON.stringify(apiResponse, null, 2));

    console.log('\n=== Test Data Created Successfully ===');

  } catch (error) {
    console.error('Error creating test referrals:', error);
  }
}

// Run the function
createTestReferrals().then(() => {
  console.log('\n=== Complete ===');
  process.exit(0);
}).catch(error => {
  console.error('Failed:', error);
  process.exit(1);
}); 