const supabase = require('./utils/supabase');

async function debugConstraintIssue() {
  console.log('🔍 Debugging Referral Constraint Issue...\n');

  try {
    // 1. Check existing referral data
    console.log('1. Checking existing referral data...');
    const { data: existingReferrals, error: referralError } = await supabase
      .from('referrals')
      .select('*')
      .limit(5);

    if (referralError) {
      console.log('   ❌ Error fetching referrals:', referralError.message);
    } else {
      console.log('   Existing referrals:', existingReferrals);
    }

    // 2. Try a simple upsert test
    console.log('\n2. Testing upsert operation...');
    const testData = {
      referrer_id: '41005a93-0ec2-4aa1-9d0c-dc4da0334f4b',
      referred_user_id: 'test-user-id-123',
      earnings_amount: 0.001,
      total_referred_earnings: 0.001
    };

    console.log('   Test data:', testData);

    const { data: upsertResult, error: upsertError } = await supabase
      .from('referrals')
      .upsert(testData, {
        onConflict: 'referrer_id,referred_user_id'
      })
      .select();

    if (upsertError) {
      console.log('   ❌ Upsert failed:', upsertError.message);
      console.log('   Error details:', upsertError);
    } else {
      console.log('   ✅ Upsert successful:', upsertResult);
    }

    // 3. Try the same upsert again to test conflict resolution
    console.log('\n3. Testing conflict resolution...');
    const { data: upsertResult2, error: upsertError2 } = await supabase
      .from('referrals')
      .upsert({
        ...testData,
        earnings_amount: 0.002,
        total_referred_earnings: 0.002
      }, {
        onConflict: 'referrer_id,referred_user_id'
      })
      .select();

    if (upsertError2) {
      console.log('   ❌ Second upsert failed:', upsertError2.message);
    } else {
      console.log('   ✅ Second upsert successful:', upsertResult2);
    }

    // 4. Test with real user data
    console.log('\n4. Testing with real user data...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, firstname, lastname, referred_by')
      .not('referred_by', 'is', null)
      .limit(1);

    if (usersError || !users || users.length === 0) {
      console.log('   ❌ No users with referrers found');
    } else {
      const user = users[0];
      console.log('   Testing with user:', user.firstname, user.lastname);
      
      const realTestData = {
        referrer_id: user.referred_by,
        referred_user_id: user.id,
        earnings_amount: 0.001,
        total_referred_earnings: 0.001
      };

      const { data: realUpsertResult, error: realUpsertError } = await supabase
        .from('referrals')
        .upsert(realTestData, {
          onConflict: 'referrer_id,referred_user_id'
        })
        .select();

      if (realUpsertError) {
        console.log('   ❌ Real upsert failed:', realUpsertError.message);
      } else {
        console.log('   ✅ Real upsert successful:', realUpsertResult);
      }
    }

  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

debugConstraintIssue(); 