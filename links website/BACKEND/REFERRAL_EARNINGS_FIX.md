# Referral Earnings Fix - Issue and Solution

## 🚨 **ISSUE IDENTIFIED**

The referral earnings system was not updating on subsequent earnings because of a **database constraint issue**.

### Root Cause
- The `referrals` table had a **unique constraint on `referred_user_id`** 
- This constraint prevented the `upsert` operation from working correctly
- When a referred user earned money multiple times, the system couldn't update the existing record

### Error Message
```
duplicate key value violates unique constraint "referrals_referred_user_id_key"
```

## 🔧 **SOLUTION**

### Step 1: Fix Database Constraints
Run this SQL in your **Supabase SQL Editor**:

```sql
-- Fix the referrals table constraint issue
ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referred_user_id_key;
ALTER TABLE referrals ADD CONSTRAINT referrals_referrer_referred_unique 
UNIQUE(referrer_id, referred_user_id);
```

### Step 2: Create Missing Table
Also run this to create the referral earnings tracking table:

```sql
-- Create referral_earnings_log table
CREATE TABLE IF NOT EXISTS referral_earnings_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id uuid REFERENCES users(id) ON DELETE CASCADE,
    referred_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    amount decimal(10,4) NOT NULL,
    source_link_id uuid REFERENCES links(id) ON DELETE CASCADE,
    earned_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_referral_earnings_log_referrer_id ON referral_earnings_log(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_log_earned_at ON referral_earnings_log(earned_at);
```

### Step 3: Use Comprehensive Fix Script
For convenience, use the complete fix script: `comprehensive-referral-fix.sql`

## ✅ **HOW IT WORKS NOW**

### Before (Broken)
- ❌ Unique constraint on `referred_user_id` only
- ❌ Couldn't update existing referral records
- ❌ Only worked for first-time earnings

### After (Fixed)
- ✅ Unique constraint on `(referrer_id, referred_user_id)` combination
- ✅ Can update existing referral records
- ✅ Works for all subsequent earnings
- ✅ Tracks individual earnings with timestamps

## 🧪 **TESTING**

After applying the fix, run the test script:

```bash
node test-referral-update.js
```

Expected output:
```
✅ Update successful: ₹0.008025
✅ Update successful: ₹0.008050
✅ Update successful: ₹0.008075
✅ Earnings match expected value
```

## 📊 **VERIFICATION**

Check that referral earnings are now updating correctly:

1. **First earning**: Referrer gets ₹0.000025 (5% of ₹0.0005)
2. **Second earning**: Referrer gets ₹0.000050 (5% of ₹0.0010)
3. **Third earning**: Referrer gets ₹0.000075 (5% of ₹0.0015)
4. **And so on...**

## 🎯 **SUMMARY**

The referral system is now working correctly:
- ✅ Referral earnings update on every earning
- ✅ Available balance includes referral earnings
- ✅ Total earnings show lifetime earnings (links + referrals)
- ✅ Withdrawal system works with referral earnings

**The fix was simple but critical**: Change the database constraint from `referred_user_id` to `(referrer_id, referred_user_id)`. 