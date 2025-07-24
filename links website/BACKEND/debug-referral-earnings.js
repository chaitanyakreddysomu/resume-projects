const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugReferralEarnings() {
  console.log('🔍 Debugging Referral Earnings System...\n');

  try {
    // 1. Check referrals table structure
    console.log('1. Checking referrals table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'referrals')
      .order('ordinal_position');

    if (tableError) {
      console.log('❌ Error checking table structure:', tableError.message);
    } else {
      console.log('✅ Referrals table structure:');
      tableInfo.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default})`);
      });
    }

    // 2. Get users with referral relationships
    console.log('\n2. Getting users with referral relationships...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, firstname, lastname, email, referred_by, referred_users')
      .limit(10);

    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
      return;
    }

    console.log(`✅ Found ${users.length} users:`);
    const referrers = users.filter(u => u.referred_users && u.referred_users.length > 0);
    const referredUsers = users.filter(u => u.referred_by);
    
    console.log(`   - ${referrers.length} users have referred others`);
    console.log(`   - ${referredUsers.length} users were referred by others`);

    // 3. Check existing referral records
    console.log('\n3. Checking existing referral records...');
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (referralsError) {
      console.log('❌ Error fetching referrals:', referralsError.message);
    } else {
      console.log(`✅ Found ${referrals.length} referral records:`);
      referrals.forEach(ref => {
        console.log(`   - Referrer: ${ref.referrer_id} -> Referred: ${ref.referred_user_id}`);
        console.log(`     Earnings: ₹${ref.earnings_amount}, Total Referred: ₹${ref.total_referred_earnings}`);
        console.log(`     Created: ${ref.created_at}`);
      });
    }

    // 4. Check referral_earnings_log table
    console.log('\n4. Checking referral_earnings_log table...');
    const { data: earningsLog, error: logError } = await supabase
      .from('referral_earnings_log')
      .select('*')
      .order('earned_at', { ascending: false })
      .limit(10);

    if (logError) {
      console.log('❌ Error fetching earnings log:', logError.message);
    } else {
      console.log(`✅ Found ${earningsLog.length} earnings log entries:`);
      earningsLog.forEach(log => {
        console.log(`   - Referrer: ${log.referrer_id} -> Referred: ${log.referred_user_id}`);
        console.log(`     Amount: ₹${log.amount}, Source Link: ${log.source_link_id}`);
        console.log(`     Earned: ${log.earned_at}`);
      });
    }

    // 5. Test the referral earnings update process
    console.log('\n5. Testing referral earnings update process...');
    
    if (referredUsers.length > 0 && referrers.length > 0) {
      const testReferredUser = referredUsers[0];
      const testReferrer = referrers[0];
      
      console.log(`Testing with referred user: ${testReferredUser.firstname} ${testReferredUser.lastname}`);
      console.log(`And referrer: ${testReferrer.firstname} ${testReferrer.lastname}`);

      // Get current referral record
      const { data: currentReferral, error: fetchError } = await supabase
        .from('referrals')
        .select('earnings_amount, total_referred_earnings')
        .eq('referrer_id', testReferrer.id)
        .eq('referred_user_id', testReferredUser.id)
        .single();

      console.log('Current referral record:', currentReferral);

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.log('❌ Error fetching current referral:', fetchError.message);
      } else {
        // Simulate earnings update
        const earningsPerView = 0.0005; // 5 paise per view
        const referralPercentage = 5; // 5%
        const referralEarnings = earningsPerView * (referralPercentage / 100);
        
        const currentEarnings = currentReferral?.earnings_amount || 0;
        const currentTotal = currentReferral?.total_referred_earnings || 0;
        const newEarnings = currentEarnings + referralEarnings;
        const newTotal = currentTotal + earningsPerView;

        console.log('Simulating earnings update:');
        console.log(`   - Earnings per view: ₹${earningsPerView}`);
        console.log(`   - Referral percentage: ${referralPercentage}%`);
        console.log(`   - Referral earnings: ₹${referralEarnings}`);
        console.log(`   - Current earnings: ₹${currentEarnings} -> New: ₹${newEarnings}`);
        console.log(`   - Current total: ₹${currentTotal} -> New: ₹${newTotal}`);

        // Test the upsert operation
        const { data: upsertResult, error: upsertError } = await supabase
          .from('referrals')
          .upsert({
            referrer_id: testReferrer.id,
            referred_user_id: testReferredUser.id,
            earnings_amount: newEarnings,
            total_referred_earnings: newTotal
          })
          .select();

        if (upsertError) {
          console.log('❌ Error in upsert operation:', upsertError.message);
        } else {
          console.log('✅ Upsert operation successful:', upsertResult);
        }

        // Test logging individual earnings
        const { data: logResult, error: logInsertError } = await supabase
          .from('referral_earnings_log')
          .insert({
            referrer_id: testReferrer.id,
            referred_user_id: testReferredUser.id,
            amount: referralEarnings,
            source_link_id: '00000000-0000-0000-0000-000000000000', // Test link ID
            earned_at: new Date().toISOString()
          })
          .select();

        if (logInsertError) {
          console.log('❌ Error logging earnings:', logInsertError.message);
        } else {
          console.log('✅ Earnings logged successfully:', logResult);
        }
      }
    } else {
      console.log('⚠️ No referral relationships found for testing');
    }

    // 6. Check for any constraint issues
    console.log('\n6. Checking for constraint issues...');
    const { data: constraints, error: constraintError } = await supabase
      .from('information_schema.table_constraints')
      .select('constraint_name, constraint_type')
      .eq('table_name', 'referrals');

    if (constraintError) {
      console.log('❌ Error checking constraints:', constraintError.message);
    } else {
      console.log('✅ Referrals table constraints:');
      constraints.forEach(constraint => {
        console.log(`   - ${constraint.constraint_name}: ${constraint.constraint_type}`);
      });
    }

    // 7. Test the actual link view tracking process
    console.log('\n7. Testing link view tracking process...');
    
    // Get a test link
    const { data: testLinks, error: linksError } = await supabase
      .from('links')
      .select('id, user_id, url, earnings')
      .limit(1);

    if (linksError) {
      console.log('❌ Error fetching test links:', linksError.message);
    } else if (testLinks && testLinks.length > 0) {
      const testLink = testLinks[0];
      console.log(`Testing with link: ${testLink.url} (User: ${testLink.user_id})`);
      console.log(`Current earnings: ₹${testLink.earnings}`);

      // Simulate a link view
      const earningsPerView = 0.0005;
      const newEarnings = testLink.earnings + earningsPerView;

      console.log(`Simulating view - earnings: ₹${testLink.earnings} -> ₹${newEarnings}`);

      // Update link earnings
      const { error: updateError } = await supabase
        .from('links')
        .update({ earnings: newEarnings })
        .eq('id', testLink.id);

      if (updateError) {
        console.log('❌ Error updating link earnings:', updateError.message);
      } else {
        console.log('✅ Link earnings updated successfully');
        
        // Now check if referral earnings should be updated
        const { data: linkUser, error: userFetchError } = await supabase
          .from('users')
          .select('referred_by')
          .eq('id', testLink.user_id)
          .single();

        if (userFetchError) {
          console.log('❌ Error fetching link user:', userFetchError.message);
        } else if (linkUser && linkUser.referred_by) {
          console.log(`Link user was referred by: ${linkUser.referred_by}`);
          
          // Check if referral earnings were updated
          const { data: updatedReferral, error: refFetchError } = await supabase
            .from('referrals')
            .select('earnings_amount, total_referred_earnings')
            .eq('referrer_id', linkUser.referred_by)
            .eq('referred_user_id', testLink.user_id)
            .single();

          if (refFetchError) {
            console.log('❌ Error fetching updated referral:', refFetchError.message);
          } else {
            console.log('Updated referral record:', updatedReferral);
          }
        } else {
          console.log('Link user was not referred by anyone');
        }
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the debug function
debugReferralEarnings().then(() => {
  console.log('\n🎉 Debug completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Debug failed:', error);
  process.exit(1);
}); 