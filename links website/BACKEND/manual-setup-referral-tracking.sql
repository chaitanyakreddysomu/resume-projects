-- Manual Setup for Referral Earnings Tracking System
-- Run this script in your Supabase SQL Editor

-- 1. Create referral_earnings_log table
CREATE TABLE IF NOT EXISTS referral_earnings_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id uuid REFERENCES users(id) ON DELETE CASCADE,
    referred_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    amount decimal(10,4) NOT NULL,
    source_link_id uuid REFERENCES links(id) ON DELETE CASCADE,
    earned_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_referral_earnings_log_referrer_id ON referral_earnings_log(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_log_earned_at ON referral_earnings_log(earned_at);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_log_referrer_earned ON referral_earnings_log(referrer_id, earned_at);

-- 3. Add function to calculate referral earnings from a specific date
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

-- 4. Add function to get total referral earnings
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

-- 5. Create a view for easy querying of referral earnings with user details
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

-- 6. Add comments for documentation
COMMENT ON TABLE referral_earnings_log IS 'Tracks individual referral earnings with timestamps for withdrawal calculations';
COMMENT ON FUNCTION get_referral_earnings_from_date IS 'Calculates referral earnings earned after a specific date';
COMMENT ON FUNCTION get_total_referral_earnings IS 'Calculates total referral earnings for a user';
COMMENT ON VIEW referral_earnings_summary IS 'Summary view of referral earnings with user details';

-- 7. Verify the setup
SELECT 'Table created successfully' as status, 'referral_earnings_log' as table_name
WHERE EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'referral_earnings_log'
);

-- 8. Show table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'referral_earnings_log'
ORDER BY ordinal_position;

-- 9. Show functions
SELECT 
    routine_name, 
    routine_type, 
    data_type
FROM information_schema.routines 
WHERE routine_name IN ('get_referral_earnings_from_date', 'get_total_referral_earnings'); 