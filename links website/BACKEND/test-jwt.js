const jwt = require('jsonwebtoken');

// Test JWT token decoding
function testJWT(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('JWT Decoded:', decoded);
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}

// Test with a sample token (you'll need to replace this with actual token)
const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ0ZjFiZWNjLWY2Y2ItNDllNS05ZTlkLWIyZDEzMWY0OGM1MiIsImVtYWlsIjoidmlzaG51Y2hhaXR1cmVkZHlAZ21haWwuY29tIiwiaWF0IjoxNzM1NzQ5NzQ5LCJleHAiOjE3MzU4MzYxNDl9.example';

console.log('Testing JWT token...');
const decoded = testJWT(sampleToken);

if (decoded) {
  console.log('User ID from token:', decoded.id);
  console.log('Email from token:', decoded.email);
} 