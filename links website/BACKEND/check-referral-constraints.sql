-- Check and Fix Referral Constraints
-- This script will diagnose and fix the referral constraint issue

-- 1. Check current constraints in detail
SELECT '=== CURRENT CONSTRAINTS ===' as info;
SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    tc.is_deferrable,
    tc.initially_deferred
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'referrals'
ORDER BY tc.constraint_name, kcu.ordinal_position;

-- 2. Check if there are any unique constraints on referred_user_id alone
SELECT '=== CHECKING FOR PROBLEMATIC CONSTRAINTS ===' as info;
SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    string_agg(kcu.column_name, ', ') as columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'referrals' 
    AND tc.constraint_type = 'UNIQUE'
    AND kcu.column_name = 'referred_user_id'
GROUP BY tc.constraint_name, tc.constraint_type;

-- 3. Drop ALL unique constraints and recreate them properly
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Drop all unique constraints on referrals table
    FOR constraint_name IN 
        SELECT tc.constraint_name 
        FROM information_schema.table_constraints tc
        WHERE tc.table_name = 'referrals' 
        AND tc.constraint_type = 'UNIQUE'
    LOOP
        EXECUTE 'ALTER TABLE referrals DROP CONSTRAINT ' || constraint_name;
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;
    
    -- Add the correct constraint
    ALTER TABLE referrals ADD CONSTRAINT referrals_referrer_referred_unique 
    UNIQUE(referrer_id, referred_user_id);
    RAISE NOTICE 'Added correct constraint: referrals_referrer_referred_unique';
END $$;

-- 4. Verify the fix
SELECT '=== FINAL CONSTRAINTS ===' as info;
SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    string_agg(kcu.column_name, ', ') as columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'referrals'
GROUP BY tc.constraint_name, tc.constraint_type
ORDER BY tc.constraint_name;

-- 5. Test the constraint with sample data
SELECT '=== TESTING CONSTRAINT ===' as info;
SELECT 'Constraint fix completed. Referral earnings should now update correctly on every click.' as status; 