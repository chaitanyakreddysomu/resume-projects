# New Referral Earnings System Guide

## Overview

The referral earnings system has been completely revamped to provide accurate tracking of earnings and available balance calculations. The new system ensures that:

1. Referral earnings are properly included in total earnings and available balance
2. Available balance shows earnings from last withdrawal to now (both links and referrals)
3. When users withdraw, available balance becomes zero for that withdrawal period
4. 5% of referred user earnings goes to the referrer in real-time

## How It Works

### Referral Earnings Calculation
- When a referred user earns ₹100, the referrer gets ₹5 (5%)
- This is calculated in real-time when links are clicked
- Stored in both `referrals` and `referral_earnings_log` tables

### Available Balance Logic
- Shows earnings from last completed withdrawal to now
- Includes both link earnings and referral earnings
- When user withdraws, available balance becomes zero
- Next earnings start building the new available balance

### Example Timeline
```
Day 1: User earns ₹100 (Available: ₹100)
Day 2: User withdraws ₹50 (Available: ₹0, Withdrawn: ₹50)
Day 3: User earns ₹30 (Available: ₹30)
Day 4: User earns ₹20 (Available: ₹50)
Day 5: User withdraws ₹40 (Available: ₹10)
```

## Setup Instructions

1. Run the database setup:
```bash
cd BACKEND
node setup-referral-tracking.js
```

2. Restart the backend:
```bash
npm start
```

3. Test the system:
```bash
node test-new-referral-system.js
```

## API Changes

### User Earnings Response
Now includes:
- `referralEarnings`: Total referral earnings
- `lastWithdrawalDate`: Date of last completed withdrawal
- `availableBalance`: Earnings from last withdrawal to now

### Available Balance Formula
```javascript
if (lastCompletedWithdrawal) {
  // Earnings from last withdrawal to now
  availableBalance = recentLinkEarnings + recentReferralEarnings - pendingWithdrawals;
} else {
  // No previous withdrawals
  availableBalance = totalEarnings - pendingWithdrawals;
}
```

## Benefits

1. Accurate tracking of referral earnings with timestamps
2. Proper available balance calculation
3. Real-time referral earnings updates
4. Consistent data across all API endpoints
5. Clear separation between withdrawn and available funds 