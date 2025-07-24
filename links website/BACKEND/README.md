# LinkEarn Backend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Database
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here

# JWT
JWT_SECRET=your_jwt_secret_here

# Email (Gmail)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# Server
PORT=5000
```

### 3. Database Setup
Run the database initialization script to check table existence:
```bash
node db/initSupabaseTables.js
```

If tables are missing, create them in Supabase SQL editor using the provided SQL.

### 4. Start Server
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify/:token` - Email verification
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/otp-verify` - OTP verification

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile/personal` - Update personal info
- `PUT /api/user/profile/security` - Update security settings
- `PUT /api/user/profile/payment` - Update payment info
- `GET /api/user/dashboard` - Get user dashboard
- `GET /api/user/earnings` - Get earnings
- `GET /api/user/transactions` - Get transactions

### Links
- `POST /api/links` - Create link
- `GET /api/links` - Get user links
- `PUT /api/links/:id` - Update link
- `DELETE /api/links/:id` - Delete link

### Withdrawals
- `POST /api/withdrawal/request` - Request withdrawal

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - Get all users
- `GET /api/admin/user/:id` - Get user details
- `PUT /api/admin/user/:id/suspend` - Suspend user
- `PUT /api/admin/user/:id/activate` - Activate user
- `GET /api/admin/payments` - Get payments
- `GET /api/admin/payments/stats` - Get payment stats

## Features

- ✅ User registration with email verification
- ✅ User login with JWT authentication
- ✅ Forgot password with email reset link
- ✅ Password reset functionality
- ✅ User profile management
- ✅ Link creation and management
- ✅ Withdrawal requests
- ✅ Admin dashboard and user management
- ✅ Email notifications (Gmail)
- ✅ Supabase database integration 