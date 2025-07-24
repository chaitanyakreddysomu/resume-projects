// Using built-in fetch (Node.js 18+)

async function testAdminAPI() {
  try {
    console.log('Testing admin API...');
    
    // Valid admin JWT token
    const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ0ZjFiZWNjLWY2Y2ItNDllNS05ZTlkLWIyZDEzMWY0OGM1MiIsImVtYWlsIjoidmlzaG51Y2hhaXR1cmVkZHlAZ21haWwuY29tIiwiaWF0IjoxNzUxNzIwMDUzLCJleHAiOjE3NTE4MDY0NTN9.ywAz9sCP7xIiKGOsTO30y1C_L6Rk2758iRTFgMJ6K4E';
    
    const response = await fetch('http://localhost:5000/api/admin/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    const data = await response.text();
    console.log('Response body:', data);
    
    if (response.ok) {
      const jsonData = JSON.parse(data);
      console.log('Users found:', jsonData.length);
    }
    
  } catch (error) {
    console.error('API test failed:', error);
  }
}

testAdminAPI(); 