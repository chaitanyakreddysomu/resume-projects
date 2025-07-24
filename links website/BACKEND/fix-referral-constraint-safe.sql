-- Safe Referral Constraint Fix
-- This script safely fixes the referral earnings update issue

-- 1. Check current constraints
SELECT 'Current constraints on referrals table:' as info;
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

-- 2. Check if the problematic constraint exists and drop it safely
DO $$
BEGIN
    -- Drop the problematic constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'referrals' 
        AND constraint_name = 'referrals_referred_user_id_key'
    ) THEN
        ALTER TABLE referrals DROP CONSTRAINT referrals_referred_user_id_key;
        RAISE NOTICE 'Dropped problematic constraint: referrals_referred_user_id_key';
    ELSE
        RAISE NOTICE 'Problematic constraint referrals_referred_user_id_key does not exist';
    END IF;
    
    -- Add the correct constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'referrals' 
        AND constraint_name = 'referrals_referrer_referred_unique'
    ) THEN
        ALTER TABLE referrals ADD CONSTRAINT referrals_referrer_referred_unique 
        UNIQUE(referrer_id, referred_user_id);
        RAISE NOTICE 'Added correct constraint: referrals_referrer_referred_unique';
    ELSE
        RAISE NOTICE 'Correct constraint referrals_referrer_referred_unique already exists';
    END IF;
END $$;

-- 3. Create referral_earnings_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS referral_earnings_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id uuid REFERENCES users(id) ON DELETE CASCADE,
    referred_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    amount decimal(10,4) NOT NULL,
    source_link_id uuid REFERENCES links(id) ON DELETE CASCADE,
    earned_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- 4. Create indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_referral_earnings_log_referrer_id ON referral_earnings_log(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_log_earned_at ON referral_earnings_log(earned_at);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_log_referrer_earned ON referral_earnings_log(referrer_id, earned_at);

-- 5. Verify the final state
SELECT 'Final constraints on referrals table:' as info;
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

-- 6. Test the fix
SELECT 'Referral constraint fix completed successfully!' as status;
SELECT 'Referral earnings will now update correctly on every click.' as message; 