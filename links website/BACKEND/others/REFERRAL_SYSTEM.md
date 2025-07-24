# Referral System Implementation

This document describes the referral system implemented in LinkEarn Pro, which allows users to earn 5% of their referred users' earnings.

## Features

### 1. Database Changes

#### Users Table
- Added `referred_by` field (UUID, nullable) to track who referred each user
- References the `users.id` field

#### Referrals Table (New)
- `id`: Primary key (UUID)
- `referrer_id`: User who made the referral (UUID, references users.id)
- `referred_user_id`: User who was referred (UUID, references users.id)
- `earnings_amount`: Amount earned by referrer from this referral (numeric)
- `total_referred_earnings`: Total earnings of the referred user (numeric)
- `created_at`: Timestamp when referral was created
- Unique constraint on `referred_user_id` to prevent multiple referrers

### 2. Backend API Endpoints

#### Registration with Referral
- **Endpoint**: `POST /api/auth/register`
- **New Field**: `referralCode` (optional)
- **Behavior**: If valid referral code provided, sets `referred_by` and creates referral record

#### Get Referral Information
- **Endpoint**: `GET /api/auth/referral-info`
- **Authentication**: Required
- **Response**: 
  ```json
  {
    "referralUrl": "http://localhost:3000/refer/{userId}",
    "referredUsersCount": 5,
    "totalReferralEarnings": 150.50,
    "totalReferredEarnings": 3010.00,
    "referredUsers": [
      {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "joinedAt": "2024-01-15T10:30:00Z",
        "earningsFromReferral": 25.50,
        "totalReferredEarnings": 510.00
      }
    ]
  }
  ```

#### Get User by Referral Code
- **Endpoint**: `GET /api/auth/referral/:referralCode`
- **Authentication**: Not required
- **Response**: User information for referral page display

#### Updated Dashboard
- **Endpoint**: `GET /api/user/dashboard`
- **New Fields**: `referralEarnings`, `totalReferredEarnings`, `referredUsersCount`

### 3. Frontend Components

#### ReferralSection Component
- Displays referral statistics
- Shows referral URL with copy functionality
- Lists referred users with their earnings
- Located in user dashboard

#### Referral Page
- **Route**: `/refer/:referralCode`
- Displays referrer information
- Provides registration link with referral code
- Handles invalid referral codes

#### Updated Registration Form
- Optional referral code field
- Supports referral codes from URL parameters (`?ref=code`)
- Pre-fills referral code if provided

### 4. Referral Earnings Logic

#### Automatic Calculation
- When a link earns money, 5% goes to the referrer
- Updated in `linkController.js` in `trackLinkView` function
- Uses Supabase RPC for atomic updates

#### Earnings Flow
1. User clicks on a link
2. Link owner earns money (CPM/1000)
3. If link owner was referred, referrer earns 5% of that amount
4. Both `earnings_amount` and `total_referred_earnings` are updated

### 5. URL Structure

#### Referral URLs
- Format: `{BASE_URL}/refer/{userId}`
- Example: `http://localhost:3000/refer/123e4567-e89b-12d3-a456-426614174000`

#### Registration with Referral
- Format: `{BASE_URL}/user-registration?ref={userId}`
- Example: `http://localhost:3000/user-registration?ref=123e4567-e89b-12d3-a456-426614174000`

### 6. User Experience Flow

1. **Referrer shares their referral link**
2. **Referred user clicks the link**
3. **Referral page shows referrer's name and benefits**
4. **User clicks "Get Started"**
5. **Registration form pre-fills referral code**
6. **User completes registration**
7. **Referral relationship is established**
8. **Referrer earns 5% of referred user's future earnings**

### 7. Dashboard Integration

#### User Dashboard
- Shows referral earnings in metrics cards
- Displays referred users count
- Includes dedicated referral section with detailed information

#### Admin Dashboard
- Referral data is included in user analytics
- Can track referral relationships and earnings

### 8. Security Considerations

- Referral codes are user IDs (UUIDs)
- No sensitive information exposed in referral URLs
- Referral relationships are immutable once established
- Validation ensures only valid user IDs can be referral codes

### 9. Testing

Use the provided test script:
```bash
node test-referral-system.js
```

This script tests:
- User registration with referral codes
- Referral information retrieval
- Referral URL endpoints
- Complete referral flow

### 10. Database Setup

Run these SQL commands in Supabase:

```sql
-- Add referred_by column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES users(id);

-- Create referrals table
CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES users(id),
  referred_user_id uuid REFERENCES users(id),
  earnings_amount numeric DEFAULT 0,
  total_referred_earnings numeric DEFAULT 0,
  created_at timestamp DEFAULT now(),
  UNIQUE(referred_user_id)
);
```

### 11. Environment Variables

Ensure these are set in your backend:
```env
FRONTEND_URL=http://localhost:3000
```

### 12. Benefits

- **For Referrers**: Earn 5% of referred users' earnings
- **For Referred Users**: Get introduced to the platform by trusted friends
- **For Platform**: Organic growth through user referrals
- **Transparency**: Clear tracking of referral relationships and earnings

The referral system is now fully integrated and ready for use! 