const fetch = require('node-fetch');

// Test rejection API with reason
async function testRejectionAPI() {
  const token = 'your-admin-token-here'; // Replace with actual admin token
  const withdrawalId = 'dfb15b56-d844-47b8-9ab9-f53d49970588'; // Replace with actual withdrawal ID
  
  try {
    console.log('Testing rejection API...');
    
    const response = await fetch(`http://localhost:5000/api/admin/withdraw/${withdrawalId}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason: 'Test rejection reason - Invalid UPI ID provided'
      })
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Rejection successful:', result);
    } else {
      const error = await response.text();
      console.error('Rejection failed:', error);
    }
  } catch (error) {
    console.error('Error testing rejection API:', error);
  }
}

// Test getting all withdrawals to see rejection reason
async function testGetWithdrawals() {
  const token = 'your-admin-token-here'; // Replace with actual admin token
  
  try {
    console.log('\nTesting get withdrawals API...');
    
    const response = await fetch('http://localhost:5000/api/admin/withdraw', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const withdrawals = await response.json();
      console.log('Withdrawals:', JSON.stringify(withdrawals, null, 2));
      
      // Check if any withdrawals have rejection reasons
      const rejectedWithdrawals = withdrawals.filter(w => w.rejection_reason);
      if (rejectedWithdrawals.length > 0) {
        console.log('\nRejected withdrawals with reasons:');
        rejectedWithdrawals.forEach(w => {
          console.log(`- ID: ${w.id}, Reason: ${w.rejection_reason}`);
        });
      }
    } else {
      const error = await response.text();
      console.error('Get withdrawals failed:', error);
    }
  } catch (error) {
    console.error('Error testing get withdrawals API:', error);
  }
}

// Run tests
async function runTests() {
  console.log('=== Testing Rejection API ===');
  await testRejectionAPI();
  await testGetWithdrawals();
}

runTests(); 