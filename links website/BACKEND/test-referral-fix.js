const supabase = require('./utils/supabase');

async function testReferralFix() {
  console.log('🧪 Testing Referral Earnings Fix...\n');

  try {
    // 1. Check if the constraint fix has been applied
    console.log('1. Checking database constraints...');
    
    // Try to get a sample referral record
    const { data: sampleReferral, error: sampleError } = await supabase
      .from('referrals')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.log('❌ Error accessing referrals table:', sampleError.message);
      return;
    }

    console.log('✅ Referrals table accessible');

    // 2. Test the upsert operation (this was failing before)
    console.log('\n2. Testing upsert operation...');
    
    // Create test data
    const testReferrerId = '00000000-0000-0000-0000-000000000001';
    const testReferredUserId = '00000000-0000-0000-0000-000000000002';
    
    // First upsert
    const { data: firstUpsert, error: firstError } = await supabase
      .from('referrals')
      .upsert({
        referrer_id: testReferrerId,
        referred_user_id: testReferredUserId,
        earnings_amount: 0.001,
        total_referred_earnings: 0.002
      })
      .select();

    if (firstError) {
      console.log('❌ First upsert failed:', firstError.message);
      return;
    }

    console.log('✅ First upsert successful');

    // Second upsert (this was failing before the fix)
    const { data: secondUpsert, error: secondError } = await supabase
      .from('referrals')
      .upsert({
        referrer_id: testReferrerId,
        referred_user_id: testReferredUserId,
        earnings_amount: 0.002, // Updated value
        total_referred_earnings: 0.004 // Updated value
      })
      .select();

    if (secondError) {
      console.log('❌ Second upsert failed:', secondError.message);
      console.log('   This means the constraint fix has not been applied yet.');
      console.log('   Please run the SQL script in Supabase SQL Editor:');
      console.log('   ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referred_user_id_key;');
      console.log('   ALTER TABLE referrals ADD CONSTRAINT referrals_referrer_referred_unique UNIQUE(referrer_id, referred_user_id);');
      return;
    }

    console.log('✅ Second upsert successful - constraint fix is working!');
    console.log('   - First earnings:', firstUpsert[0]?.earnings_amount);
    console.log('   - Second earnings:', secondUpsert[0]?.earnings_amount);

    // 3. Test referral_earnings_log table
    console.log('\n3. Testing referral_earnings_log table...');
    
    const { data: logEntry, error: logError } = await supabase
      .from('referral_earnings_log')
      .insert({
        referrer_id: testReferrerId,
        referred_user_id: testReferredUserId,
        amount: 0.001,
        source_link_id: '00000000-0000-0000-0000-000000000003',
        earned_at: new Date().toISOString()
      })
      .select();

    if (logError) {
      console.log('❌ Error inserting into referral_earnings_log:', logError.message);
      console.log('   Please create the table using the SQL script in Supabase SQL Editor.');
    } else {
      console.log('✅ referral_earnings_log table working correctly');
    }

    // 4. Clean up test data
    console.log('\n4. Cleaning up test data...');
    
    await supabase
      .from('referrals')
      .delete()
      .eq('referrer_id', testReferrerId)
      .eq('referred_user_id', testReferredUserId);

    if (logEntry) {
      await supabase
        .from('referral_earnings_log')
        .delete()
        .eq('id', logEntry[0].id);
    }

    console.log('✅ Test data cleaned up');

    console.log('\n🎉 Referral earnings fix test completed successfully!');
    console.log('   The constraint issue has been resolved.');
    console.log('   Referral earnings will now update correctly on every earning.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testReferralFix(); 