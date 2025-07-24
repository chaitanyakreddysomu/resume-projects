# Postman Test Guide for Admin Users API

## Overview
This guide shows you how to test the updated `/api/admin/users` endpoint that now includes:
- **Total Earned** (Lifetime earnings)
- **Available for Withdraw** (Current available balance)
- **Monthly Earnings** (Current month earnings)

## API Endpoint
```
GET http://localhost:5000/api/admin/users
```

## Headers Required
```
Authorization: Bearer <YOUR_ADMIN_JWT_TOKEN>
Content-Type: application/json
```

## How to Get Admin JWT Token

### Method 1: Login as Admin
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "your-admin-email@example.com",
  "password": "your-admin-password"
}
```

### Method 2: Use Existing Token
If you already have an admin token, use it directly in the Authorization header.

## Expected Response Structure

```json
[
  {
    "id": "1f9d0fbd-88fb-4126-a508-f40581ff2593",
    "name": "chaitu reddy",
    "email": "chaitanyakumarreddysomu9010@gmail.com",
    "createdat": "2025-07-03T10:53:15.738949",
    "phone": "9876543234",
    "role": "user",
    "verified": true,
    "totalEarnings": "3.68",           // Link earnings only
    "totalEarned": "3.69",             // Lifetime total (links + referrals)
    "availableForWithdraw": "3.69",    // Available balance after withdrawals
    "monthlyEarnings": "3.68",         // Current month earnings
    "totalLinks": 9,
    "totalClicks": 6,
    "withdrawHistory": [],
    "suspend": false,
    "status": "active",
    "referredBy": null,
    "referredUsers": [
      "742248c7-9553-423a-a28c-75893921adfe",
      "41005a93-0ec2-4aa1-9d0c-dc4da0334f4b"
    ]
  }
]
```

## Earnings Calculation Logic

### 1. Total Earned (Lifetime)
```
Total Earned = Link Earnings + Referral Earnings
```
- **Link Earnings**: Sum of all earnings from user's links
- **Referral Earnings**: Sum of all referral earnings from `referrals` table

### 2. Available for Withdraw
```
Available for Withdraw = Recent Earnings - Pending Withdrawals
```
- **Recent Earnings**: Earnings from last completed withdrawal to now
- **Pending Withdrawals**: Sum of all requested (not completed) withdrawals
- If no previous withdrawals: `Total Earned - Pending Withdrawals`

### 3. Monthly Earnings
```
Monthly Earnings = Monthly Link Earnings + Monthly Referral Earnings
```
- **Monthly Link Earnings**: Earnings from link views in current month (IST timezone)
- **Monthly Referral Earnings**: Referral earnings earned in current month (IST timezone)

## Step-by-Step Postman Test

### Step 1: Set up the Request
1. Open Postman
2. Create a new GET request
3. Set URL: `http://localhost:5000/api/admin/users`

### Step 2: Add Headers
```
Authorization: Bearer <YOUR_ADMIN_JWT_TOKEN>
Content-Type: application/json
```

### Step 3: Send Request
Click "Send" and you should receive a JSON response with all users and their earnings data.

### Step 4: Verify Response
Check that each user object contains:
- ✅ `totalEarned` field (lifetime earnings)
- ✅ `availableForWithdraw` field (available balance)
- ✅ `monthlyEarnings` field (current month earnings)
- ✅ `totalEarnings` field (link earnings only)

## Example Test Cases

### Test Case 1: User with No Earnings
```json
{
  "id": "user-id",
  "name": "New User",
  "totalEarnings": "0.00",
  "totalEarned": "0.00",
  "availableForWithdraw": "0.00",
  "monthlyEarnings": "0.00",
  "totalLinks": 0,
  "totalClicks": 0
}
```

### Test Case 2: User with Earnings and Withdrawals
```json
{
  "id": "user-id",
  "name": "Active User",
  "totalEarnings": "100.00",      // Link earnings
  "totalEarned": "120.00",        // Total lifetime (100 + 20 referral)
  "availableForWithdraw": "50.00", // After withdrawals
  "monthlyEarnings": "25.00",     // Current month
  "totalLinks": 5,
  "totalClicks": 150
}
```

## Troubleshooting

### Error: 401 Unauthorized
- Check that your JWT token is valid
- Ensure the token belongs to an admin user
- Verify the Authorization header format: `Bearer <token>`

### Error: 403 Forbidden
- The user is not an admin
- Check the user's role in the database

### Error: 500 Internal Server Error
- Check the backend server logs
- Verify database connection
- Ensure all required tables exist

### Missing Fields in Response
- Check that the backend server is running the latest code
- Verify the admin controller has been updated
- Restart the backend server if needed

## Database Tables Required

The API uses these tables:
1. **`users`** - User information
2. **`links`** - User's links and earnings
3. **`referrals`** - Referral earnings
4. **`referral_earnings_log`** - Monthly referral tracking
5. **`link_views`** - Link view tracking for monthly earnings
6. **`withdrawals`** - Withdrawal history

## Testing Different Scenarios

### Scenario 1: New User
- User has no links, no referrals, no withdrawals
- Expected: All earnings fields should be 0.00

### Scenario 2: User with Links Only
- User has links but no referrals
- Expected: `totalEarned` = `totalEarnings`, `availableForWithdraw` = `totalEarned` - pending withdrawals

### Scenario 3: User with Referrals Only
- User has referrals but no links
- Expected: `totalEarned` = referral earnings, `totalEarnings` = 0.00

### Scenario 4: User with Withdrawals
- User has earned money and made withdrawals
- Expected: `availableForWithdraw` < `totalEarned`

### Scenario 5: User with Monthly Activity
- User has activity in current month
- Expected: `monthlyEarnings` > 0.00

## Success Criteria

✅ API returns 200 status code
✅ Response contains all required fields
✅ `totalEarned` = `totalEarnings` + referral earnings
✅ `availableForWithdraw` ≤ `totalEarned`
✅ `monthlyEarnings` reflects current month activity
✅ All amounts are formatted with 2 decimal places
✅ No negative values in earnings fields 