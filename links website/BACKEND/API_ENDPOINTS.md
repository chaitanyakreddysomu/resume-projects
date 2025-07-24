# LinkEarn Pro API Endpoints

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### 1. User Registration
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123"
  }
  ```
- **Response:** `{ "message": "Registration successful, check your email for verification." }`

### 2. Email Verification
- **GET** `/auth/verify/:token`
- **Response:** `{ "message": "Email verified successfully." }`

### 3. User Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** `{ "token": "jwt_token", "role": "user", "name": "John Doe", "email": "john@example.com" }`

### 4. OTP Verification (2FA)
- **POST** `/auth/otp-verify`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```
- **Response:** `{ "token": "jwt_token" }`

### 5. Forgot Password
- **POST** `/auth/forgot-password`
- **Body:**
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Response:** `{ "message": "If an account with that email exists, a password reset link has been sent." }`

### 6. Reset Password
- **POST** `/auth/reset-password`
- **Body:**
  ```json
  {
    "token": "reset_token",
    "newPassword": "newpassword123"
  }
  ```
- **Response:** `{ "message": "Password reset successfully" }`

---

## User Management Endpoints

### 7. Get User Profile
- **GET** `/user/profile`
- **Auth:** Required
- **Response:**
  ```json
  {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "profilephoto": "url",
    "role": "user",
    "verified": true
  }
  ```

### 8. Update Personal Information
- **PUT** `/user/profile/personal`
- **Auth:** Required
- **Body:**
  ```json
  {
    "firstname": "John",
    "lastname": "Doe",
    "phone": "1234567890",
    "profilePhoto": "url"
  }
  ```
- **Response:** `{ "message": "Personal info updated successfully", "user": {...} }`

### 9. Update Security Settings
- **PUT** `/user/profile/security`
- **Auth:** Required
- **Body:**
  ```json
  {
    "oldPassword": "oldpassword",
    "newPassword": "newpassword",
    "enable2FA": true
  }
  ```
- **Response:** `{ "message": "Security settings updated" }`

### 10. Update Payment Information
- **PUT** `/user/profile/payment`
- **Auth:** Required
- **Body:**
  ```json
  {
    "upi1": "upi@bank",
    "upi2": "upi@bank2",
    "emailOtp": "123456"
  }
  ```
- **Response:** `{ "message": "Payment info updated" }`

### 11. Send UPI OTP
- **POST** `/user/profile/payment/send-otp`
- **Auth:** Required
- **Body:**
  ```json
  {
    "upiId": "upi@bank",
    "action": "add"
  }
  ```
- **Response:** `{ "message": "OTP sent to your email" }`

### 12. Verify UPI OTP
- **POST** `/user/profile/payment/verify-otp`
- **Auth:** Required
- **Body:**
  ```json
  {
    "upiId": "upi@bank",
    "otp": "123456",
    "action": "add"
  }
  ```
- **Response:** `{ "message": "UPI verified and saved" }`

### 13. Delete UPI
- **DELETE** `/user/profile/payment`
- **Auth:** Required
- **Body:**
  ```json
  {
    "upiId": "upi@bank",
    "otp": "123456"
  }
  ```
- **Response:** `{ "message": "UPI deleted successfully" }`

---

## Dashboard & Analytics Endpoints

### 14. Get User Dashboard
- **GET** `/user/dashboard`
- **Auth:** Required
- **Response:**
  ```json
  {
    "totalEarnings": 1234.5,
    "monthlyEarnings": 623.5,
    "dailyEarnings": 22.5,
    "clicks": 1247,
    "activeLinks": 12,
    "earningsOverview": [
      { "date": "2025-01-01", "amount": 12.5 }
    ],
    "links": [...]
  }
  ```

### 15. Get User Earnings
- **GET** `/user/earnings`
- **Auth:** Required
- **Response:**
  ```json
  {
    "total": 1250,
    "currentMonth": 623.5,
    "pendingWithdrawals": 230,
    "availableBalance": 420
  }
  ```

### 16. Get Earnings Analytics
- **GET** `/user/earnings/analytics`
- **Auth:** Required
- **Response:**
  ```json
  {
    "totalEarnings": 1250,
    "totalClicks": 1500,
    "activeLinks": 10,
    "last30DaysEarnings": 500,
    "last7DaysEarnings": 150,
    "last24HoursEarnings": 25,
    "topPerformingLinks": [...],
    "earningsTrend": [...]
  }
  ```

### 17. Get User Transactions
- **GET** `/user/transactions`
- **Auth:** Required
- **Response:**
  ```json
  [
    {
      "amount": 120,
      "upi": "upi@bank",
      "status": "pending",
      "date": "2025-06-20"
    }
  ]
  ```

---

## Link Management Endpoints

### 18. Create Link
- **POST** `/links`
- **Auth:** Required
- **Body:**
  ```json
  {
    "url": "custom-alias",
    "originalUrl": "https://example.com",
    "expiryDate": "2025-12-31",
    "pages": 4
  }
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "url": "custom-alias",
    "originalurl": "https://example.com",
    "clicks": 0,
    "earnings": 0,
    "status": "active"
  }
  ```

### 19. Get User Links
- **GET** `/links`
- **Auth:** Required
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "url": "abc123",
      "originalurl": "https://example.com",
      "clicks": 150,
      "earnings": 25.5,
      "status": "active",
      "createdat": "2025-01-01T00:00:00Z",
      "expirydate": "2025-12-31"
    }
  ]
  ```

### 20. Update Link
- **PUT** `/links/:id`
- **Auth:** Required
- **Body:**
  ```json
  {
    "originalurl": "https://newexample.com",
    "expirydate": "2025-12-31",
    "pages": 5,
    "status": "active"
  }
  ```
- **Response:** Updated link object

### 21. Delete Link
- **DELETE** `/links/:id`
- **Auth:** Required
- **Response:** `{ "message": "Link deleted successfully" }`

### 22. Check Alias Availability
- **GET** `/links/check-alias?alias=custom-alias`
- **Auth:** Not required
- **Response:**
  ```json
  {
    "alias": "custom-alias",
    "available": true,
    "message": "Alias is available"
  }
  ```

### 23. Track Link View
- **POST** `/links/:linkId/track-view`
- **Auth:** Not required
- **Response:**
  ```json
  {
    "message": "View tracked successfully",
    "isUnique": true,
    "earningsAdded": 0.002
  }
  ```

### 24. Get Link Analytics
- **GET** `/links/:linkId/analytics`
- **Auth:** Required
- **Response:**
  ```json
  {
    "link": {
      "id": "uuid",
      "url": "abc123",
      "originalurl": "https://example.com",
      "cpm": 640,
      "pages": 4
    },
    "totalClicks": 150,
    "totalEarnings": 25.5,
    "daily": [
      {
        "date": "2025-01-01",
        "clicks": 10,
        "earnings": 1.7
      }
    ]
  }
  ```

---

## Withdrawal Endpoints

### 25. Request Withdrawal
- **POST** `/withdrawal/request`
- **Auth:** Required
- **Body:**
  ```json
  {
    "amount": 100,
    "upi": "upi@bank",
    "emailOtp": "123456"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Withdrawal requested successfully",
    "withdrawal": {
      "id": "uuid",
      "amount": 100,
      "status": "requested",
      "date": "2025-01-01T00:00:00Z"
    }
  }
  ```

### 26. Get User Withdrawals
- **GET** `/withdrawal/user`
- **Auth:** Required
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "amount": 100,
      "upi": "upi@bank",
      "status": "requested",
      "date": "2025-01-01T00:00:00Z"
    }
  ]
  ```

### 27. Get Withdrawal Statistics (Admin)
- **GET** `/withdrawal/stats`
- **Auth:** Required (Admin)
- **Response:**
  ```json
  {
    "totalWithdrawals": 50,
    "totalAmount": 5000,
    "pendingWithdrawals": 10,
    "pendingAmount": 1000,
    "completedWithdrawals": 35,
    "completedAmount": 3500,
    "failedWithdrawals": 5,
    "recentWithdrawals": [...]
  }
  ```

### 28. Get All Withdrawals (Admin)
- **GET** `/withdrawal/all`
- **Auth:** Required (Admin)
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "amount": 100,
      "upi": "upi@bank",
      "status": "requested",
      "date": "2025-01-01T00:00:00Z",
      "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "upi": "upi@bank"
      }
    }
  ]
  ```

### 29. Complete Withdrawal (Admin)
- **PUT** `/withdrawal/:id/complete`
- **Auth:** Required (Admin)
- **Response:**
  ```json
  {
    "message": "Withdrawal marked as completed",
    "withdrawal": {...}
  }
  ```

### 30. Reject Withdrawal (Admin)
- **PUT** `/withdrawal/:id/reject`
- **Auth:** Required (Admin)
- **Body:**
  ```json
  {
    "reason": "Invalid UPI ID"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Withdrawal rejected successfully",
    "withdrawal": {...}
  }
  ```

---

## Admin Endpoints

### 31. Get Admin Dashboard
- **GET** `/admin/dashboard`
- **Auth:** Required (Admin)
- **Response:**
  ```json
  {
    "totalUsers": 2030,
    "activeLinks": 5130,
    "pendingWithdrawals": 38,
    "revenue": "23550.25",
    "serverLoad": "normal",
    "recentActivity": [...]
  }
  ```

### 32. Get All Users (Admin)
- **GET** `/admin/users`
- **Auth:** Required (Admin)
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "createdat": "2025-01-01T00:00:00Z",
      "phone": "1234567890",
      "role": "user",
      "verified": true,
      "totalEarnings": "1000.00",
      "totalEarned": "1200.00",
      "monthlyEarnings": "150.00",
      "totalLinks": 5,
      "totalClicks": 250,
      "withdrawHistory": [...],
      "suspend": false,
      "status": "active",
      "referredBy": "uuid",
      "referredUsers": ["uuid1", "uuid2"]
    }
  ]
  ```

### 33. Get User Details (Admin)
- **GET** `/admin/user/:id`
- **Auth:** Required (Admin)
- **Response:**
  ```json
  {
    "profile": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "verified": true,
      "registered": "2025-01-01T00:00:00Z",
      "upi": "upi@bank"
    },
    "totalEarnings": "1000.00",
    "links": [...],
    "withdrawals": [...]
  }
  ```

### 34. Suspend User (Admin)
- **PUT** `/admin/user/:id/suspend`
- **Auth:** Required (Admin)
- **Response:** `{ "message": "User suspended successfully", "user": {...} }`

### 35. Activate User (Admin)
- **PUT** `/admin/user/:id/activate`
- **Auth:** Required (Admin)
- **Response:** `{ "message": "User activated successfully", "user": {...} }`

### 36. Get All Payments (Admin)
- **GET** `/admin/payments`
- **Auth:** Required (Admin)
- **Response:**
  ```json
  [
    {
      "id": "uuid",
      "user": "John Doe",
      "email": "john@example.com",
      "amount": 250,
      "upi": "upi@bank",
      "status": "requested",
      "date": "2025-06-28T00:00:00Z"
    }
  ]
  ```

### 37. Get Payment Statistics (Admin)
- **GET** `/admin/payments/stats`
- **Auth:** Required (Admin)
- **Response:**
  ```json
  {
    "pendingAmount": "3400.00",
    "processedToday": "500.00",
    "failedTransactions": 120
  }
  ```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Missing or invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Testing Endpoints

### 38. Test Links API
- **GET** `/links/test`
- **Auth:** Not required
- **Response:** `{ "message": "Links API is working", "timestamp": "2025-01-01T00:00:00Z" }`

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firstname text,
  lastname text,
  email text UNIQUE,
  phone text,
  password text,
  profilephoto text,
  verified boolean DEFAULT false,
  verifyToken text,
  resetToken text,
  resetTokenExpiry timestamp,
  enable2FA boolean DEFAULT false,
  otp text,
  upi text,
  role text DEFAULT 'user',
  suspend boolean DEFAULT false,
  createdat timestamp DEFAULT now()
);
```

### Links Table
```sql
CREATE TABLE links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  url text,
  originalurl text,
  expirydate date,
  pages integer DEFAULT 4,
  cpm numeric DEFAULT 160,
  clicks integer DEFAULT 0,
  earnings numeric DEFAULT 0,
  createdat timestamp DEFAULT now(),
  status text DEFAULT 'active'
);
```

### Link Views Table
```sql
CREATE TABLE link_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid REFERENCES links(id) ON DELETE CASCADE,
  user_agent text,
  ip_address text,
  viewed_at timestamp DEFAULT now(),
  UNIQUE(link_id, ip_address, user_agent)
);
```

### Withdrawals Table
```sql
CREATE TABLE withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  amount numeric,
  upi text,
  status text,
  date timestamp DEFAULT now(),
  processed_at timestamp,
  processed_by uuid REFERENCES users(id),
  rejection_reason text
);
``` 