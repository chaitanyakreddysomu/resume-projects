-- Add referred_users column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'referred_users'
    ) THEN
        ALTER TABLE users ADD COLUMN referred_users uuid[] DEFAULT '{}';
        RAISE NOTICE 'Added referred_users column to users table';
    ELSE
        RAISE NOTICE 'referred_users column already exists';
    END IF;
END $$;

-- Create or replace the add_referred_user function
CREATE OR REPLACE FUNCTION add_referred_user(referrer_id uuid, new_referred_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Update the referrer's referred_users array to include the new user
  UPDATE users 
  SET referred_users = array_append(referred_users, new_referred_user_id)
  WHERE id = referrer_id;
  
  -- Log the operation
  RAISE NOTICE 'Added user % to referrer % referred_users array', new_referred_user_id, referrer_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION add_referred_user(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION add_referred_user(uuid, uuid) TO service_role;

-- Create or replace the add_referred_users_column function
CREATE OR REPLACE FUNCTION add_referred_users_column()
RETURNS void AS $$
BEGIN
  -- Add the referred_users column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'referred_users'
  ) THEN
    ALTER TABLE users ADD COLUMN referred_users uuid[] DEFAULT '{}';
    RAISE NOTICE 'Added referred_users column to users table';
  ELSE
    RAISE NOTICE 'referred_users column already exists';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION add_referred_users_column() TO authenticated;
GRANT EXECUTE ON FUNCTION add_referred_users_column() TO service_role;

-- Verify the setup
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'referred_users';

-- Show the function
SELECT 
    routine_name, 
    routine_type, 
    data_type
FROM information_schema.routines 
WHERE routine_name IN ('add_referred_user', 'add_referred_users_column'); 