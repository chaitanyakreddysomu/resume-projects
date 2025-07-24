# Referral Earnings Fix Guide

## 🚨 Issue: Referral Earnings Not Being Calculated/Stored

The referral system is working for adding users to the `referred_users` array, but the earnings calculation and storage in the `referrals` table is not working properly.

## Root Cause Analysis

1. **Incorrect Supabase RPC call**: The code was trying to use `supabase.rpc('add')` which doesn't exist
2. **Missing referral records**: Some referral records might not exist in the `referrals` table
3. **Incorrect earnings calculation**: The earnings calculation logic needed improvement

## ✅ Fixed Issues

### 1. Fixed Link Controller (`linkController.js`)

**Before (Broken):**
```javascript
const { error: referralError } = await supabase
  .from('referrals')
  .update({
    earnings_amount: supabase.rpc('add', { x: 'earnings_amount', y: referralEarnings }),
    total_referred_earnings: supabase.rpc('add', { x: 'total_referred_earnings', y: earningsPerView })
  })
```

**After (Fixed):**
```javascript
// First, get current referral record
const { data: currentReferral, error: fetchError } = await supabase
  .from('referrals')
  .select('earnings_amount, total_referred_earnings')
  .eq('referrer_id', user.referred_by)
  .eq('referred_user_id', link.user_id)
  .single();

// Calculate new values
const currentEarnings = currentReferral?.earnings_amount || 0;
const currentTotal = currentReferral?.total_referred_earnings || 0;
const newEarnings = currentEarnings + referralEarnings;
const newTotal = currentTotal + earningsPerView;

// Update referral earnings using upsert
const { error: referralError } = await supabase
  .from('referrals')
  .upsert({
    referrer_id: user.referred_by,
    referred_user_id: link.user_id,
    earnings_amount: newEarnings,
    total_referred_earnings: newTotal
  });
```

### 2. Enhanced Logging

Added comprehensive logging to track:
- Referral earnings calculation
- Current vs new earnings values
- Success/failure of updates

### 3. Database Structure Verification

Created `check-referrals-table.sql` to ensure the `referrals` table has the correct structure.

## 🔧 Setup Steps

### Step 1: Run Database Fix Script

Go to your Supabase dashboard → SQL Editor and run:

```sql
-- Run the check-referrals-table.sql script
-- This will ensure the referrals table exists with correct structure
```

### Step 2: Test the System

Run the test script to verify everything is working:

```bash
cd BACKEND
node others/test-referral-earnings.js
```

### Step 3: Verify Frontend Display

The frontend should now properly display:
- Referral earnings (5% of referred user's earnings)
- Total referred earnings
- Individual user earnings breakdown

## 📊 How It Works Now

### Earnings Calculation Flow

1. **User A refers User B**
   - User B's `referred_by` field is set to User A's ID
   - User B is added to User A's `referred_users` array
   - A record is created in the `referrals` table

2. **User B's link gets clicked**
   - Link earns money (e.g., ₹0.10 per click)
   - 5% of that earning goes to User A (₹0.005)
   - The `referrals` table is updated with:
     - `earnings_amount`: Total referral earnings (₹0.005)
     - `total_referred_earnings`: Total earnings of referred user (₹0.10)

3. **User A views their referral dashboard**
   - Shows total referral earnings from all referred users
   - Shows individual earnings from each referred user

### Example Scenario

```
User A refers User B
User B creates a link with CPM ₹100
User B's link gets 10 clicks = ₹1.00 earnings
User A gets 5% = ₹0.05 referral earnings

In referrals table:
- referrer_id: User A's ID
- referred_user_id: User B's ID  
- earnings_amount: ₹0.05 (User A's earnings)
- total_referred_earnings: ₹1.00 (User B's total earnings)
```

## 🧪 Testing

### Manual Test

1. Create two test accounts
2. Use one account to refer the other
3. Create a link with the referred account
4. Click the link multiple times
5. Check the referrer's dashboard for earnings

### API Test

Test the referral info endpoint:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/referral-info
```

Expected response:
```json
{
  "referralUrl": "http://localhost:3000/refer/USER_ID",
  "referredUsersCount": 1,
  "totalReferralEarnings": 0.05,
  "totalReferredEarnings": 1.00,
  "referredUsers": [
    {
      "id": "referred_user_id",
      "name": "Referred User",
      "email": "referred@example.com",
      "joinedAt": "2024-01-01T00:00:00Z",
      "earningsFromReferral": 0.05,
      "totalReferredEarnings": 1.00
    }
  ]
}
```

## 🔍 Troubleshooting

### Issue: No referral earnings showing

1. Check if referral records exist:
   ```sql
   SELECT * FROM referrals WHERE referrer_id = 'YOUR_USER_ID';
   ```

2. Check if users have referrers:
   ```sql
   SELECT id, firstname, lastname, referred_by FROM users WHERE referred_by IS NOT NULL;
   ```

3. Check link clicks and earnings:
   ```sql
   SELECT l.id, l.url, l.clicks, l.earnings, u.firstname 
   FROM links l 
   JOIN users u ON l.user_id = u.id 
   WHERE u.referred_by IS NOT NULL;
   ```

### Issue: Incorrect earnings calculation

1. Verify CPM values in links table
2. Check the calculation logic in `trackLinkView` function
3. Ensure referral percentage is 5% (0.05)

### Issue: Database errors

1. Run the `check-referrals-table.sql` script
2. Check Supabase logs for any constraint violations
3. Verify foreign key relationships

## 📈 Monitoring

### Key Metrics to Monitor

1. **Referral Conversion Rate**: Users who sign up with referral codes
2. **Referral Earnings**: Total earnings from referrals
3. **Referred User Activity**: How active referred users are
4. **Earnings Distribution**: How much referrers earn vs referred users

### Log Analysis

Look for these log messages in your backend:
- `"Processing referral earnings:"` - Shows calculation details
- `"Referral earnings updated successfully:"` - Confirms successful updates
- `"Error updating referral earnings:"` - Indicates issues

## 🎯 Next Steps

1. **Deploy the fixes** to your production environment
2. **Run the test script** to verify everything works
3. **Monitor the logs** for any errors
4. **Test with real users** to ensure the referral system works end-to-end

## 📞 Support

If you encounter any issues:

1. Check the backend logs for error messages
2. Run the test script to identify specific problems
3. Verify the database structure using the SQL script
4. Test the API endpoints manually

The referral earnings system should now work correctly, calculating and storing 5% of referred users' earnings for the referrer. 