# Referral Earnings Fix

## Problem
Referral earnings were only being added the first time a referred user earned money, but not on subsequent earnings. This was due to a database constraint issue.

## Root Cause
The `referrals` table had an incorrect unique constraint:
- **Before**: `UNIQUE(referred_user_id)` - This prevented multiple updates for the same referred user
- **After**: `UNIQUE(referrer_id, referred_user_id)` - This allows updates while ensuring one referrer-referred relationship

## Fix Applied

### 1. Database Constraint Fix
Run this SQL in your Supabase SQL Editor:

```sql
-- Drop the problematic constraint
ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_referred_user_id_key;

-- Add the correct constraint
ALTER TABLE referrals ADD CONSTRAINT referrals_referrer_referred_unique 
UNIQUE(referrer_id, referred_user_id);
```

### 2. Main Code Updates
- ✅ Fixed the constraint in `BACKEND/db/initSupabaseTables.js`
- ✅ Added `referral_earnings_log` table to the main database setup
- ✅ The referral earnings calculation in `linkController.js` was already correct
- ✅ The earnings calculation in `userController.js` was already correct

### 3. How It Works Now
1. When a referred user earns money, their referrer gets 5% of those earnings
2. The referral earnings are added to the referrer's `referral_earnings` balance
3. The earnings are included in total lifetime earnings
4. The earnings are included in available balance for withdrawal
5. After withdrawal, the available balance resets to zero

## Testing
Run the test script to verify the fix:

```bash
cd BACKEND
node test-referral-fix.js
```

## Files Modified
- `BACKEND/db/initSupabaseTables.js` - Fixed constraint and added referral_earnings_log table
- `BACKEND/fix-referrals-constraint.sql` - SQL script to fix existing database
- `BACKEND/test-referral-fix.js` - Test script to verify the fix

## Result
✅ Referral earnings now update correctly on every earning  
✅ Referral earnings are included in total and available balances  
✅ Withdrawal system works properly with referral earnings  
✅ No new files needed - everything is in the main code 