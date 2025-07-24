-- Comprehensive Referral System Fix
-- Run this script in your Supabase SQL Editor to fix all referral issues

-- 1. Fix the referrals table constraint issue
-- Drop the problematic unique constraint on referred_user_id
ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referred_user_id_key;

-- Create the correct unique constraint on the combination of referrer_id and referred_user_id
ALTER TABLE referrals ADD CONSTRAINT referrals_referrer_referred_unique 
UNIQUE(referrer_id, referred_user_id);

-- 2. Create referral_earnings_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS referral_earnings_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id uuid REFERENCES users(id) ON DELETE CASCADE,
    referred_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    amount decimal(10,4) NOT NULL,
    source_link_id uuid REFERENCES links(id) ON DELETE CASCADE,
    earned_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_referral_earnings_log_referrer_id ON referral_earnings_log(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_log_earned_at ON referral_earnings_log(earned_at);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_log_referrer_earned ON referral_earnings_log(referrer_id, earned_at);

-- 4. Add function to calculate referral earnings from a specific date
CREATE OR REPLACE FUNCTION get_referral_earnings_from_date(
    p_referrer_id uuid,
    p_from_date timestamp with time zone
)
RETURNS decimal(10,4) AS $$
BEGIN
    RETURN COALESCE((
        SELECT SUM(amount)
        FROM referral_earnings_log
        WHERE referrer_id = p_referrer_id
        AND earned_at > p_from_date
    ), 0);
END;
$$ LANGUAGE plpgsql;

-- 5. Add function to get total referral earnings
CREATE OR REPLACE FUNCTION get_total_referral_earnings(p_referrer_id uuid)
RETURNS decimal(10,4) AS $$
BEGIN
    RETURN COALESCE((
        SELECT SUM(amount)
        FROM referral_earnings_log
        WHERE referrer_id = p_referrer_id
    ), 0);
END;
$$ LANGUAGE plpgsql;

-- 6. Create a view for easy querying of referral earnings with user details
CREATE OR REPLACE VIEW referral_earnings_summary AS
SELECT 
    rel.referrer_id,
    rel.referred_user_id,
    u.firstname,
    u.lastname,
    u.email,
    SUM(rel.amount) as total_earnings,
    COUNT(rel.id) as earnings_count,
    MIN(rel.earned_at) as first_earning,
    MAX(rel.earned_at) as last_earning
FROM referral_earnings_log rel
JOIN users u ON rel.referred_user_id = u.id
GROUP BY rel.referrer_id, rel.referred_user_id, u.firstname, u.lastname, u.email;

-- 7. Verify the fixes
SELECT 'Referral system fixes completed successfully' as status;

-- 8. Show current constraints
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

-- 9. Show table structures
SELECT 'referrals' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'referrals'
ORDER BY ordinal_position;

SELECT 'referral_earnings_log' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'referral_earnings_log'
ORDER BY ordinal_position;

-- 10. Show current referral data
SELECT 
    'Current Referrals' as info,
    referrer_id,
    referred_user_id,
    earnings_amount,
    total_referred_earnings,
    created_at
FROM referrals
ORDER BY created_at DESC; 