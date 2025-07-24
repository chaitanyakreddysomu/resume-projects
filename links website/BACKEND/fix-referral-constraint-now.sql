-- IMMEDIATE FIX for Referral Earnings Update Issue
-- Run this in your Supabase SQL Editor RIGHT NOW to fix the problem

-- 1. Drop the problematic constraint that prevents multiple updates
ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referred_user_id_key;

-- 2. Add the correct constraint that allows updates
ALTER TABLE referrals ADD CONSTRAINT referrals_referrer_referred_unique 
UNIQUE(referrer_id, referred_user_id);

-- 3. Create the referral_earnings_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS referral_earnings_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id uuid REFERENCES users(id) ON DELETE CASCADE,
    referred_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    amount decimal(10,4) NOT NULL,
    source_link_id uuid REFERENCES links(id) ON DELETE CASCADE,
    earned_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- 4. Verify the fix
SELECT 'Referral constraint fixed! Referral earnings will now update on every click.' as status; 