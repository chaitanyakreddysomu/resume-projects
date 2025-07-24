const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testReferralUpdate() {
  console.log('🧪 Testing Referral Earnings Update...\n');

  try {
    // 1. Get existing referral relationship
    console.log('1. Getting existing referral relationship...');
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .limit(1);

    if (referralsError) {
      console.log('❌ Error fetching referrals:', referralsError.message);
      return;
    }

    if (!referrals || referrals.length === 0) {
      console.log('❌ No referral relationships found');
      return;
    }

    const referral = referrals[0];
    console.log('✅ Found referral relationship:');
    console.log(`   - Referrer: ${referral.referrer_id}`);
    console.log(`   - Referred User: ${referral.referred_user_id}`);
    console.log(`   - Current Earnings: ₹${referral.earnings_amount}`);
    console.log(`   - Total Referred Earnings: ₹${referral.total_referred_earnings}`);

    // 2. Simulate multiple earnings updates
    console.log('\n2. Simulating multiple earnings updates...');
    
    const earningsPerView = 0.0005; // 5 paise per view
    const referralPercentage = 5; // 5%
    const referralEarnings = earningsPerView * (referralPercentage / 100);
    
    console.log(`   - Earnings per view: ₹${earningsPerView}`);
    console.log(`   - Referral percentage: ${referralPercentage}%`);
    console.log(`   - Referral earnings per view: ₹${referralEarnings}`);

    let currentEarnings = referral.earnings_amount;
    let currentTotal = referral.total_referred_earnings;

    // Simulate 5 views
    for (let i = 1; i <= 5; i++) {
      currentEarnings += referralEarnings;
      currentTotal += earningsPerView;

      console.log(`\n   View ${i}:`);
      console.log(`     - Earnings: ₹${currentEarnings.toFixed(6)}`);
      console.log(`     - Total Referred: ₹${currentTotal.toFixed(6)}`);

      // Update the referral record
      const { data: updateResult, error: updateError } = await supabase
        .from('referrals')
        .upsert({
          referrer_id: referral.referrer_id,
          referred_user_id: referral.referred_user_id,
          earnings_amount: currentEarnings,
          total_referred_earnings: currentTotal
        })
        .select();

      if (updateError) {
        console.log(`     ❌ Update failed: ${updateError.message}`);
      } else {
        console.log(`     ✅ Update successful: ₹${updateResult[0].earnings_amount}`);
      }

      // Log individual earning
      const { error: logError } = await supabase
        .from('referral_earnings_log')
        .insert({
          referrer_id: referral.referrer_id,
          referred_user_id: referral.referred_user_id,
          amount: referralEarnings,
          source_link_id: '00000000-0000-0000-0000-000000000000', // Test link ID
          earned_at: new Date().toISOString()
        });

      if (logError) {
        console.log(`     ⚠️ Logging failed: ${logError.message}`);
      } else {
        console.log(`     📝 Earnings logged`);
      }

      // Wait a bit between updates
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 3. Verify final state
    console.log('\n3. Verifying final state...');
    const { data: finalReferral, error: finalError } = await supabase
      .from('referrals')
      .select('earnings_amount, total_referred_earnings')
      .eq('referrer_id', referral.referrer_id)
      .eq('referred_user_id', referral.referred_user_id)
      .single();

    if (finalError) {
      console.log('❌ Error fetching final state:', finalError.message);
    } else {
      console.log('✅ Final referral state:');
      console.log(`   - Earnings: ₹${finalReferral.earnings_amount}`);
      console.log(`   - Total Referred: ₹${finalReferral.total_referred_earnings}`);
      
      const expectedEarnings = referral.earnings_amount + (5 * referralEarnings);
      const expectedTotal = referral.total_referred_earnings + (5 * earningsPerView);
      
      console.log(`   - Expected Earnings: ₹${expectedEarnings.toFixed(6)}`);
      console.log(`   - Expected Total: ₹${expectedTotal.toFixed(6)}`);
      
      if (Math.abs(finalReferral.earnings_amount - expectedEarnings) < 0.000001) {
        console.log('   ✅ Earnings match expected value');
      } else {
        console.log('   ❌ Earnings do not match expected value');
      }
    }

    // 4. Check earnings log
    console.log('\n4. Checking earnings log...');
    const { data: earningsLog, error: logFetchError } = await supabase
      .from('referral_earnings_log')
      .select('amount, earned_at')
      .eq('referrer_id', referral.referrer_id)
      .eq('referred_user_id', referral.referred_user_id)
      .order('earned_at', { ascending: false })
      .limit(10);

    if (logFetchError) {
      console.log('❌ Error fetching earnings log:', logFetchError.message);
    } else {
      console.log(`✅ Found ${earningsLog.length} earnings log entries`);
      const totalLogged = earningsLog.reduce((sum, log) => sum + parseFloat(log.amount), 0);
      console.log(`   - Total logged: ₹${totalLogged.toFixed(6)}`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testReferralUpdate().then(() => {
  console.log('\n🎉 Test completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
}); 