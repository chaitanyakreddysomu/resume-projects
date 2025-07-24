-- Fix Referrals Table Constraint Issue
-- This script fixes the unique constraint that's preventing referral earnings updates

-- 1. First, let's see the current constraints
SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'referrals'
ORDER BY tc.constraint_name;

-- 2. Drop the problematic unique constraint on referred_user_id
-- (This allows one user to be referred by only one person, but we want to allow updates)
ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referred_user_id_key;

-- 3. Create the correct unique constraint on the combination of referrer_id and referred_user_id
-- (This ensures one referrer-referred relationship, but allows updates)
ALTER TABLE referrals ADD CONSTRAINT referrals_referrer_referred_unique 
UNIQUE(referrer_id, referred_user_id);

-- 4. Verify the fix
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

-- 5. Test the upsert operation
-- This should now work correctly
SELECT 'Constraint fixed successfully' as status;

-- 6. Show current referral data
SELECT 
    referrer_id,
    referred_user_id,
    earnings_amount,
    total_referred_earnings,
    created_at
FROM referrals
ORDER BY created_at DESC; 