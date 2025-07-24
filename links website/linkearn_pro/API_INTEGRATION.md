                                # Withdrawal API Integration

This document describes the integration of the withdrawal API in the admin payment processing page.

## API Endpoints Used

### 1. Get All Withdrawals
- **Endpoint**: `GET /api/admin/withdraw`
- **Purpose**: Fetch all withdrawal requests for admin review
- **Authentication**: Bearer token + Admin role required
- **Response**: Array of withdrawal objects with user information

### 2. Get Withdrawal Statistics
- **Endpoint**: `GET /api/admin/withdraw/stats`
- **Purpose**: Get summary statistics for dashboard
- **Authentication**: Bearer token + Admin role required
- **Response**: Object with counts and amounts by status

### 3. Get Withdrawal by ID
- **Endpoint**: `GET /api/admin/withdraw/:id`
- **Purpose**: Get detailed withdrawal information
- **Authentication**: Bearer token + Admin role required
- **Response**: Withdrawal object with user details

### 4. Complete Withdrawal
- **Endpoint**: `PUT /api/admin/withdraw/:id/complete`
- **Purpose**: Mark withdrawal as completed
- **Authentication**: Bearer token + Admin role required
- **Response**: Updated withdrawal object

### 5. Reject Withdrawal
- **Endpoint**: `PUT /api/admin/withdraw/:id/reject`
- **Purpose**: Reject withdrawal with reason
- **Authentication**: Bearer token + Admin role required
- **Body**: `{ reason: string }`
- **Response**: Updated withdrawal object

## Data Transformation

The API response is transformed to match the frontend component expectations:

```javascript
// API Response
{
  id: "123",
  user_id: "456",
  amount: 2500,
  upi: "user@paytm",
  status: "requested",
  date: "2024-01-15T10:30:00Z",
  user: {
    name: "John Doe",
    email: "john@example.com"
  }
}

// Transformed for Frontend
{
  id: "123",
  userId: "456",
  userName: "John Doe",
  userEmail: "john@example.com",
  amount: 2500,
  upiId: "user@paytm",
  status: "requested",
  riskLevel: "medium",
  riskFactors: ["Medium withdrawal amount", "Pending approval"]
}
```

## Risk Assessment

Risk levels are calculated based on:
- **High Risk**: Amount > ₹5000
- **Medium Risk**: Amount > ₹2000
- **Low Risk**: Amount ≤ ₹2000

## Error Handling

The integration includes comprehensive error handling:
- Authentication errors (401/403)
- Server errors (500)
- Network errors
- Data validation errors

## Loading States

The UI shows loading states during:
- Initial data fetch
- API actions (approve/reject)
- Data refresh

## Features

- ✅ Real-time data from API
- ✅ Loading and error states
- ✅ Bulk actions (approve/reject multiple)
- ✅ Risk assessment
- ✅ Summary statistics
- ✅ Filtering and search
- ✅ Table and card view modes
- ✅ Refresh functionality
- ✅ Responsive design

## Usage

1. Ensure the backend API is running
2. Set the correct API URL in `src/utils/config.js`
3. Ensure admin authentication token is available
4. Navigate to the admin payment processing page

## Environment Variables

```env
VITE_API_URL=http://localhost:5000
```

## Dependencies

- `fetch` API for HTTP requests
- Local storage for token management
- React hooks for state management

## Troubleshooting

### Common Issues

1. **404 Error**
   - Ensure backend server is running on correct port
   - Verify API URL in `src/utils/config.js`
   - Check that routes are properly mounted in `app.js`

2. **401 Unauthorized**
   - Verify admin token is stored in localStorage
   - Ensure token hasn't expired
   - Check that user has admin role in database

3. **403 Forbidden**
   - User doesn't have admin privileges
   - Check user role in database (`role` field should be 'admin')

4. **500 Server Error**
   - Check backend server logs
   - Verify database connection
   - Check Supabase configuration

### Testing API Endpoints

Use the provided test script:
```bash
node test-withdrawal-api.js
```

Make sure to:
1. Replace `TEST_TOKEN` with actual admin token
2. Ensure backend server is running
3. Check console output for detailed error messages 