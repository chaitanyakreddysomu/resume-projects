const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateReferralData() {
  console.log('🔄 Starting Referral Data Migration...\n');

  try {
    // 1. First, ensure the referred_users column exists
    console.log('1. Checking if referred_users column exists...');
    
    // Try to add the column if it doesn't exist (this will fail if it already exists, which is fine)
    const { error: columnError } = await supabase.rpc('add_referred_users_column');
    
    if (columnError) {
      console.log('Column might already exist or error occurred:', columnError.message);
    } else {
      console.log('✅ referred_users column created successfully');
    }

    // 2. Get all users with referred_by field
    console.log('\n2. Fetching users with referred_by field...');
    const { data: usersWithReferrals, error: usersError } = await supabase
      .from('users')
      .select('id, referred_by, referred_users')
      .not('referred_by', 'is', null);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }

    console.log(`Found ${usersWithReferrals.length} users with referred_by field`);

    // 3. Group users by their referrer
    const referrerGroups = {};
    usersWithReferrals.forEach(user => {
      if (user.referred_by) {
        if (!referrerGroups[user.referred_by]) {
          referrerGroups[user.referred_by] = [];
        }
        referrerGroups[user.referred_by].push(user.id);
      }
    });

    console.log(`Found ${Object.keys(referrerGroups).length} referrers`);

    // 4. Update each referrer's referred_users array
    console.log('\n3. Updating referred_users arrays...');
    let successCount = 0;
    let errorCount = 0;

    for (const [referrerId, referredUserIds] of Object.entries(referrerGroups)) {
      try {
        // Get current referred_users array
        const { data: currentUser, error: fetchError } = await supabase
          .from('users')
          .select('referred_users')
          .eq('id', referrerId)
          .single();

        if (fetchError) {
          console.error(`❌ Error fetching user ${referrerId}:`, fetchError.message);
          errorCount++;
          continue;
        }

        // Merge existing array with new referred users
        const currentArray = currentUser.referred_users || [];
        const newArray = [...new Set([...currentArray, ...referredUserIds])]; // Remove duplicates

        // Update the referrer's referred_users array
        const { error: updateError } = await supabase
          .from('users')
          .update({ referred_users: newArray })
          .eq('id', referrerId);

        if (updateError) {
          console.error(`❌ Error updating user ${referrerId}:`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Updated referrer ${referrerId} with ${referredUserIds.length} referred users`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error processing referrer ${referrerId}:`, err.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`✅ Successfully updated: ${successCount} referrers`);
    console.log(`❌ Errors: ${errorCount} referrers`);

    // 5. Verify the migration
    console.log('\n4. Verifying migration...');
    const { data: verificationData, error: verifyError } = await supabase
      .from('users')
      .select('id, referred_users')
      .not('referred_users', 'is', null);

    if (verifyError) {
      console.error('❌ Error verifying migration:', verifyError);
    } else {
      const totalReferredUsers = verificationData.reduce((sum, user) => {
        return sum + (user.referred_users ? user.referred_users.length : 0);
      }, 0);
      
      console.log(`✅ Verification complete:`);
      console.log(`   - Users with referred_users array: ${verificationData.length}`);
      console.log(`   - Total referred users across all referrers: ${totalReferredUsers}`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// SQL function to add the column if it doesn't exist
async function createColumnFunction() {
  console.log('📝 Creating SQL function to add referred_users column...');
  
  const sql = `
    CREATE OR REPLACE FUNCTION add_referred_users_column()
    RETURNS void AS $$
    BEGIN
      -- Add the referred_users column if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'referred_users'
      ) THEN
        ALTER TABLE users ADD COLUMN referred_users uuid[] DEFAULT '{}';
      END IF;
    END;
    $$ LANGUAGE plpgsql;
  `;

  try {
    // This would need to be run in Supabase SQL editor
    console.log('⚠️  Please run this SQL in your Supabase SQL editor:');
    console.log(sql);
  } catch (error) {
    console.error('Error creating function:', error);
  }
}

// Run the migration
async function main() {
  await createColumnFunction();
  console.log('\n' + '='.repeat(50) + '\n');
  await migrateReferralData();
}

main().then(() => {
  console.log('\n🎉 Migration process completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
}); 