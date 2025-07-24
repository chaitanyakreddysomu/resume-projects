# Referral System Setup Guide

## 🚨 IMPORTANT: Fix for Referral System Not Working

The referral system is not working because the `referred_users` array is not being populated correctly. Follow these steps to fix it:

## Step 1: Database Setup

### 1.1 Run SQL Script in Supabase
Go to your Supabase dashboard → SQL Editor and run this script:

```sql
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
```

### 1.2 Verify Setup
Run this query to verify everything is set up correctly:

```sql
-- Check if column exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'referred_users';

-- Check if function exists
SELECT routine_name, routine_type, data_type
FROM information_schema.routines 
WHERE routine_name = 'add_referred_user';
```

## Step 2: Migrate Existing Data

### 2.1 Run Migration Script
If you have existing users with `referred_by` field, run the migration script:

```bash
# Set your environment variables
export SUPABASE_URL="your-supabase-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run the migration
node migrate-referral-data.js
```

This will populate the `referred_users` array for all existing referrers.

## Step 3: Test the System

### 3.1 Run Test Script
Test if everything is working:

```bash
node test-referral-debug.js
```

This will:
- Check if the function exists
- Test the complete referral flow
- Verify data is being stored correctly

### 3.2 Manual Testing
1. Create a new user with a referral code
2. Check the referrer's `referred_users` array in the database
3. Verify the referral info API returns the correct data

## Step 4: API Endpoints

### Registration with Referral
**POST** `/api/auth/register`
```json
{
  "firstname": "John",
  "lastname": "Doe", 
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "referralCode": "referrer-user-id"
}
```

### Get Referral Info
**GET** `/api/auth/referral-info`
- Requires authentication
- Returns referral URL, referred users count, and earnings

### Get User by Referral Code
**GET** `/api/auth/referral/:referralCode`
- Used during registration to validate referral codes

## Step 5: Frontend Integration

### Referral Page
- Route: `/refer/:referralCode`
- Shows referral benefits and registration form

### User Dashboard
- Shows referral statistics
- Lists referred users
- Displays referral earnings

## Step 6: Troubleshooting

### Common Issues

1. **Function not found error**
   - Make sure you ran the SQL script in Supabase
   - Check function permissions

2. **Column not found error**
   - Verify the `referred_users` column exists
   - Check column permissions

3. **Array not updating**
   - Check server logs for function call errors
   - Verify the fallback manual update is working

4. **No referred users showing**
   - Check if `referred_users` array is populated
   - Verify the API is returning correct data

### Debug Commands

```bash
# Check database structure
node test-referral-debug.js

# Migrate existing data
node migrate-referral-data.js

# Check server logs for registration errors
# Look for "Processing referral for user:" messages
```

## Step 7: Verification

After setup, verify:

1. ✅ `referred_users` column exists in users table
2. ✅ `add_referred_user` function exists and is callable
3. ✅ New registrations with referral codes update the array
4. ✅ Referral info API returns correct data
5. ✅ Frontend displays referred users correctly

## Database Schema

### Users Table
```sql
ALTER TABLE users ADD COLUMN referred_users uuid[] DEFAULT '{}';
```

### Referrals Table
```sql
CREATE TABLE referrals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id uuid REFERENCES users(id),
  referred_user_id uuid REFERENCES users(id),
  earnings_amount decimal(10,2) DEFAULT 0,
  total_referred_earnings decimal(10,2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);
```

## How It Works

1. **Registration**: When a user registers with a referral code:
   - Set `referred_by` field to referrer's ID
   - Create entry in `referrals` table
   - Call `add_referred_user` function to update referrer's array

2. **Referral Info**: When fetching referral info:
   - Get `referred_users` array from current user
   - Fetch details of all referred users
   - Calculate total earnings from referrals

3. **Earnings**: When referred users earn money:
   - Update `earnings_amount` in referrals table
   - Calculate 5% commission for referrer

This system ensures that referred users are properly tracked and displayed in the referral program section. 