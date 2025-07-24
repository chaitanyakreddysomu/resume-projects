-- Check and fix referrals table structure
-- This script ensures the referrals table exists with the correct structure

-- Check if referrals table exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'referrals'
    ) THEN
        -- Create referrals table if it doesn't exist
        CREATE TABLE referrals (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            referrer_id uuid REFERENCES users(id) ON DELETE CASCADE,
            referred_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
            earnings_amount decimal(10,4) DEFAULT 0,
            total_referred_earnings decimal(10,4) DEFAULT 0,
            created_at timestamp with time zone DEFAULT now(),
            updated_at timestamp with time zone DEFAULT now(),
            UNIQUE(referrer_id, referred_user_id)
        );
        
        -- Create indexes for better performance
        CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
        CREATE INDEX idx_referrals_referred_user_id ON referrals(referred_user_id);
        
        RAISE NOTICE 'Created referrals table';
    ELSE
        RAISE NOTICE 'Referrals table already exists';
    END IF;
END $$;

-- Check if columns exist and have correct types
DO $$ 
BEGIN
    -- Check earnings_amount column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'referrals' AND column_name = 'earnings_amount'
    ) THEN
        ALTER TABLE referrals ADD COLUMN earnings_amount decimal(10,4) DEFAULT 0;
        RAISE NOTICE 'Added earnings_amount column';
    END IF;
    
    -- Check total_referred_earnings column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'referrals' AND column_name = 'total_referred_earnings'
    ) THEN
        ALTER TABLE referrals ADD COLUMN total_referred_earnings decimal(10,4) DEFAULT 0;
        RAISE NOTICE 'Added total_referred_earnings column';
    END IF;
    
    -- Check created_at column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'referrals' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE referrals ADD COLUMN created_at timestamp with time zone DEFAULT now();
        RAISE NOTICE 'Added created_at column';
    END IF;
    
    -- Check updated_at column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'referrals' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE referrals ADD COLUMN updated_at timestamp with time zone DEFAULT now();
        RAISE NOTICE 'Added updated_at column';
    END IF;
END $$;

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'referrals' 
        AND constraint_name = 'referrals_referrer_referred_unique'
    ) THEN
        ALTER TABLE referrals ADD CONSTRAINT referrals_referrer_referred_unique 
        UNIQUE(referrer_id, referred_user_id);
        RAISE NOTICE 'Added unique constraint';
    END IF;
END $$;

-- Show table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'referrals'
ORDER BY ordinal_position;

-- Show any existing referral data
SELECT 
    r.id,
    r.referrer_id,
    r.referred_user_id,
    r.earnings_amount,
    r.total_referred_earnings,
    r.created_at,
    referrer.name as referrer_name,
    referred.name as referred_name
FROM referrals r
LEFT JOIN (
    SELECT id, CONCAT(firstname, ' ', lastname) as name 
    FROM users
) referrer ON r.referrer_id = referrer.id
LEFT JOIN (
    SELECT id, CONCAT(firstname, ' ', lastname) as name 
    FROM users
) referred ON r.referred_user_id = referred.id
ORDER BY r.created_at DESC
LIMIT 10; 