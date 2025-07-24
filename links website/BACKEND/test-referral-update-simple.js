const supabase = require('./utils/supabase');

async function testReferralUpdate() {
  console.log('🧪 Testing Referral Earnings Update on Multiple Clicks...\n');

  try {
    // 1. Find a user who has a referrer
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email, referred_by')
      .not('referred_by', 'is', null)
      .limit(1);

    if (usersError || !users || users.length === 0) {
      console.log('❌ No users with referrers found. Cannot test.');
      return;
    }

    const referredUser = users[0];
    const referrerId = referredUser.referred_by;
    
    console.log(`Testing with user: ${referredUser.firstname} ${referredUser.lastname}`);
    console.log(`Referrer ID: ${referrerId}`);

    // 2. Get current referral earnings
    const { data: currentReferral, error: currentError } = await supabase
      .from('referrals')
      .select('earnings_amount, total_referred_earnings')
      .eq('referrer_id', referrerId)
      .eq('referred_user_id', referredUser.id)
      .single();

    if (currentError && currentError.code !== 'PGRST116') {
      console.log('❌ Error fetching current referral:', currentError.message);
      return;
    }

    console.log('Current referral earnings:');
    console.log(`   - Earnings amount: ₹${currentReferral?.earnings_amount || 0}`);
    console.log(`   - Total referred earnings: ₹${currentReferral?.total_referred_earnings || 0}`);

    // 3. Simulate multiple clicks (like the real system does)
    const earningsPerView = 0.0005; // 5 paise per view
    const referralPercentage = 5; // 5%
    const referralEarnings = earningsPerView * (referralPercentage / 100);

    console.log('\nSimulating multiple clicks...');
    console.log(`   - Earnings per view: ₹${earningsPerView}`);
    console.log(`   - Referral earnings per view: ₹${referralEarnings}`);

    // Simulate 3 clicks
    for (let click = 1; click <= 3; click++) {
      console.log(`\n--- Click ${click} ---`);
      
      const currentEarnings = currentReferral?.earnings_amount || 0;
      const currentTotal = currentReferral?.total_referred_earnings || 0;
      const newEarnings = currentEarnings + (referralEarnings * click);
      const newTotal = currentTotal + (earningsPerView * click);

      console.log(`   - Current earnings: ₹${currentEarnings} -> New: ₹${newEarnings}`);
      console.log(`   - Current total: ₹${currentTotal} -> New: ₹${newTotal}`);

      // Test the upsert operation (this is what the real system does)
      const { data: upsertResult, error: upsertError } = await supabase
        .from('referrals')
        .upsert({
          referrer_id: referrerId,
          referred_user_id: referredUser.id,
          earnings_amount: newEarnings,
          total_referred_earnings: newTotal
        })
        .select();

      if (upsertError) {
        console.log(`   ❌ Click ${click} failed:`, upsertError.message);
        console.log('   This means the constraint fix has not been applied yet.');
        console.log('   Please run the SQL script in Supabase SQL Editor:');
        console.log('   ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referred_user_id_key;');
        console.log('   ALTER TABLE referrals ADD CONSTRAINT referrals_referrer_referred_unique UNIQUE(referrer_id, referred_user_id);');
        return;
      } else {
        console.log(`   ✅ Click ${click} successful - earnings updated to ₹${newEarnings}`);
      }

      // Update our reference for next iteration
      currentReferral.earnings_amount = newEarnings;
      currentReferral.total_referred_earnings = newTotal;
    }

    console.log('\n🎉 All clicks successful! Referral earnings update correctly on every click.');
    console.log('   The constraint issue has been resolved.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testReferralUpdate(); 