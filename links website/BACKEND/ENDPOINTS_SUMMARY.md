# LinkEarn Pro API Endpoints Summary

## Authentication (6 endpoints)
- `POST /auth/register` - User registration
- `GET /auth/verify/:token` - Email verification
- `POST /auth/login` - User login
- `POST /auth/otp-verify` - OTP verification (2FA)
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password

## User Management (9 endpoints)
- `GET /user/profile` - Get user profile
- `PUT /user/profile/personal` - Update personal info
- `PUT /user/profile/security` - Update security settings
- `PUT /user/profile/payment` - Update payment info
- `POST /user/profile/payment/send-otp` - Send UPI OTP
- `POST /user/profile/payment/verify-otp` - Verify UPI OTP
- `DELETE /user/profile/payment` - Delete UPI
- `GET /user/dashboard` - Get user dashboard
- `GET /user/earnings` - Get user earnings
- `GET /user/earnings/analytics` - Get earnings analytics
- `GET /user/transactions` - Get user transactions

## Link Management (7 endpoints)
- `POST /links` - Create link
- `GET /links` - Get user links
- `PUT /links/:id` - Update link
- `DELETE /links/:id` - Delete link
- `GET /links/check-alias` - Check alias availability
- `POST /links/:linkId/track-view` - Track link view
- `GET /links/:linkId/analytics` - Get link analytics

## Withdrawal Management (6 endpoints)
- `POST /withdrawal/request` - Request withdrawal
- `GET /withdrawal/user` - Get user withdrawals
- `GET /withdrawal/stats` - Get withdrawal stats (Admin)
- `GET /withdrawal/all` - Get all withdrawals (Admin)
- `PUT /withdrawal/:id/complete` - Complete withdrawal (Admin)
- `PUT /withdrawal/:id/reject` - Reject withdrawal (Admin)

## Admin Management (7 endpoints)
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/users` - Get all users
- `GET /admin/user/:id` - Get user details
- `PUT /admin/user/:id/suspend` - Suspend user
- `PUT /admin/user/:id/activate` - Activate user
- `GET /admin/payments` - Get all payments
- `GET /admin/payments/stats` - Get payment stats

## Testing (1 endpoint)
- `GET /links/test` - Test API health

## Total: 36 Endpoints

### Key Features Implemented:
✅ User authentication with JWT
✅ Email verification system
✅ 2FA support with OTP
✅ Password reset functionality
✅ Link creation and management
✅ Real-time earnings calculation
✅ Unique view tracking
✅ Analytics and reporting
✅ Withdrawal system
✅ Admin panel with user management
✅ Payment processing
✅ Database integration with Supabase

### Database Tables:
- `users` - User accounts and profiles
- `links` - Shortened links with earnings
- `link_views` - Unique view tracking
- `withdrawals` - Withdrawal requests and processing

### Security Features:
- JWT authentication
- Password hashing with bcrypt
- Email verification
- 2FA support
- Admin role-based access
- Input validation
- Error handling

### Earnings System:
- CPM-based earnings (Cost Per Mille)
- Unique view tracking by IP + User Agent
- Real-time earnings calculation
- Withdrawal processing
- Balance management 