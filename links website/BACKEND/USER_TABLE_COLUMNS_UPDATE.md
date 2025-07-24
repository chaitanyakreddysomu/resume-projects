# User Table Columns Update

## Overview
Added two new columns to the admin user management table to provide better insights into user earnings:

1. **Total Earned** - Lifetime earnings (link earnings + referral earnings)
2. **Monthly Earnings** - Current month earnings

## Changes Made

### Backend Changes

#### 1. Updated Admin Controller (`controllers/adminController.js`)
- Modified `getUsers` function to calculate:
  - `totalEarned`: Sum of link earnings + referral earnings (lifetime)
  - `monthlyEarnings`: Current month earnings from links + referral earnings
- Added referral earnings calculation from `referrals` table
- Added monthly earnings calculation using `referral_earnings_log` table
- Enhanced link query to include `createdat` for monthly filtering

#### 2. API Response Structure
The `/admin/users` endpoint now returns:
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "totalEarnings": "1000.00",    // Link earnings only
  "totalEarned": "1200.00",      // Lifetime total (links + referrals)
  "monthlyEarnings": "150.00",   // Current month earnings
  "totalLinks": 5,
  "status": "active"
}
```

### Frontend Changes

#### 1. Updated User Table Component (`UserTable.jsx`)
- Added "Total Earned" column with lifetime earnings display
- Added "Monthly Earnings" column with current month earnings
- Updated table headers to reflect new columns
- Added mobile responsive cards with new columns
- Enhanced formatting with descriptive labels

#### 2. Table Structure
```
┌─────────┬──────────┬──────────────┬──────────────┬─────────────────┬─────────────────┬────────┬─────────┬──────────┐
│ Select  │ User     │ Registered   │ Referred By  │ Total Earned    │ Monthly Earnings│ Links  │ Status  │ Actions  │
├─────────┼──────────┼──────────────┼──────────────┼─────────────────┼─────────────────┼────────┼─────────┼──────────┤
│ ☐       │ John Doe │ Jan 15, 2025 │ Jane Smith   │ ₹1,200.0000     │ ₹150.0000       │ 5      │ Active  │ 👁️ ⛔   │
└─────────┴──────────┴──────────────┴──────────────┴─────────────────┴─────────────────┴────────┴─────────┴──────────┘
```

## Earnings Calculation Logic

### Total Earned (Lifetime)
```
Total Earned = Link Earnings + Referral Earnings
```
- **Link Earnings**: Sum of all earnings from user's links
- **Referral Earnings**: Sum of all referral earnings from `referrals` table

### Monthly Earnings (Current Month)
```
Monthly Earnings = Monthly Link Earnings + Monthly Referral Earnings
```
- **Monthly Link Earnings**: Earnings from link views in current month (calculated from `link_views` table)
- **Monthly Referral Earnings**: Referral earnings earned in current month (from `referral_earnings_log`)

## Database Tables Used

1. **`links`** - For link earnings, creation dates, and CPM values
2. **`link_views`** - For calculating monthly earnings from actual views
3. **`referrals`** - For total referral earnings
4. **`referral_earnings_log`** - For monthly referral earnings (if available)

## Testing

Run the test script to verify calculations:
```bash
node test-user-table-columns.js
```

## Benefits

1. **Better Financial Tracking**: Admins can see both lifetime and current month earnings
2. **Performance Monitoring**: Monthly earnings help identify active users
3. **Revenue Insights**: Total earned shows complete user value
4. **Withdrawal Planning**: Monthly earnings help predict withdrawal requests

## Notes

- Monthly earnings reset to zero if user withdraws all available balance
- Total earned continues to accumulate regardless of withdrawals
- Fallback to total referral earnings if `referral_earnings_log` table is not available
- All amounts displayed with 4 decimal places for precision 