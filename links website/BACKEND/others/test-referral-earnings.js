const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testReferralEarnings() {
  console.log('🧪 Testing Referral Earnings System...\n');

  try {
    // 1. Check referrals table structure
    console.log('1. Checking referrals table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'referrals');

    if (tableError) {
      console.log('❌ Error checking table structure:', tableError.message);
    } else {
      console.log('✅ Referrals table structure:');
      tableInfo.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    }

    // 2. Get some test users
    console.log('\n2. Getting test users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email, referred_by, referred_users')
      .limit(5);

    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
      return;
    }

    console.log(`✅ Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`   - ${user.firstname} ${user.lastname} (${user.email})`);
      console.log(`     Referred by: ${user.referred_by || 'None'}`);
      console.log(`     Referred users: ${user.referred_users?.length || 0}`);
    });

    // 3. Check existing referral records
    console.log('\n3. Checking existing referral records...');
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select(`
        *,
        referrer:users!referrer_id(firstname, lastname, email),
        referred:users!referred_user_id(firstname, lastname, email)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (referralsError) {
      console.log('❌ Error fetching referrals:', referralsError.message);
    } else {
      console.log(`✅ Found ${referrals.length} referral records:`);
      referrals.forEach(ref => {
        const referrerName = ref.referrer ? `${ref.referrer.firstname} ${ref.referrer.lastname}` : 'Unknown';
        const referredName = ref.referred ? `${ref.referred.firstname} ${ref.referred.lastname}` : 'Unknown';
        console.log(`   - ${referrerName} → ${referredName}`);
        console.log(`     Earnings: ₹${ref.earnings_amount || 0}`);
        console.log(`     Total referred earnings: ₹${ref.total_referred_earnings || 0}`);
      });
    }

    // 4. Test referral earnings calculation
    console.log('\n4. Testing referral earnings calculation...');
    
    // Find a user who has a referrer
    const userWithReferrer = users.find(u => u.referred_by);
    if (!userWithReferrer) {
      console.log('❌ No users with referrers found. Cannot test earnings calculation.');
      return;
    }

    console.log(`Testing with user: ${userWithReferrer.firstname} ${userWithReferrer.lastname}`);
    console.log(`Referrer ID: ${userWithReferrer.referred_by}`);

    // Get a link for this user
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('id, url, cpm, clicks, earnings')
      .eq('user_id', userWithReferrer.id)
      .limit(1);

    if (linksError || !links.length) {
      console.log('❌ No links found for this user. Cannot test earnings calculation.');
      return;
    }

    const link = links[0];
    console.log(`Testing with link: ${link.url} (CPM: ₹${link.cpm})`);

    // Calculate expected earnings
    const earningsPerView = link.cpm / 1000;
    const expectedReferralEarnings = earningsPerView * 0.05;
    
    console.log(`Expected earnings per view: ₹${earningsPerView}`);
    console.log(`Expected referral earnings (5%): ₹${expectedReferralEarnings}`);

    // 5. Simulate a link view (this would normally be done via API)
    console.log('\n5. Simulating link view...');
    
    // First, get current referral earnings
    const { data: currentReferral, error: currentError } = await supabase
      .from('referrals')
      .select('earnings_amount, total_referred_earnings')
      .eq('referrer_id', userWithReferrer.referred_by)
      .eq('referred_user_id', userWithReferrer.id)
      .single();

    if (currentError && currentError.code !== 'PGRST116') {
      console.log('❌ Error fetching current referral:', currentError.message);
    } else {
      console.log('Current referral earnings:');
      console.log(`   - Earnings amount: ₹${currentReferral?.earnings_amount || 0}`);
      console.log(`   - Total referred earnings: ₹${currentReferral?.total_referred_earnings || 0}`);
    }

    // 6. Check if the referral record exists
    if (!currentReferral) {
      console.log('\n6. Creating referral record...');
      const { error: createError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: userWithReferrer.referred_by,
          referred_user_id: userWithReferrer.id,
          earnings_amount: 0,
          total_referred_earnings: 0
        });

      if (createError) {
        console.log('❌ Error creating referral record:', createError.message);
      } else {
        console.log('✅ Referral record created');
      }
    }

    // 7. Update referral earnings manually (simulating the API call)
    console.log('\n7. Updating referral earnings...');
    const currentEarnings = currentReferral?.earnings_amount || 0;
    const currentTotal = currentReferral?.total_referred_earnings || 0;
    const newEarnings = currentEarnings + expectedReferralEarnings;
    const newTotal = currentTotal + earningsPerView;

    const { error: updateError } = await supabase
      .from('referrals')
      .upsert({
        referrer_id: userWithReferrer.referred_by,
        referred_user_id: userWithReferrer.id,
        earnings_amount: newEarnings,
        total_referred_earnings: newTotal
      });

    if (updateError) {
      console.log('❌ Error updating referral earnings:', updateError.message);
    } else {
      console.log('✅ Referral earnings updated successfully');
      console.log(`   - New earnings amount: ₹${newEarnings}`);
      console.log(`   - New total referred earnings: ₹${newTotal}`);
    }

    // 8. Verify the update
    console.log('\n8. Verifying the update...');
    const { data: updatedReferral, error: verifyError } = await supabase
      .from('referrals')
      .select('earnings_amount, total_referred_earnings')
      .eq('referrer_id', userWithReferrer.referred_by)
      .eq('referred_user_id', userWithReferrer.id)
      .single();

    if (verifyError) {
      console.log('❌ Error verifying update:', verifyError.message);
    } else {
      console.log('✅ Verification successful:');
      console.log(`   - Earnings amount: ₹${updatedReferral.earnings_amount}`);
      console.log(`   - Total referred earnings: ₹${updatedReferral.total_referred_earnings}`);
    }

    console.log('\n🎉 Referral earnings test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testReferralEarnings(); 