const jwt = require('jsonwebtoken');

// Function to decode JWT without verification (for debugging)
function decodeJWT(token) {
  try {
    const decoded = jwt.decode(token);
    console.log('JWT Token Contents:');
    console.log(JSON.stringify(decoded, null, 2));
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Function to verify JWT with secret
function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('JWT Token Verified:');
    console.log(JSON.stringify(decoded, null, 2));
    return decoded;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return null;
  }
}

// Instructions
console.log('=== JWT Token Debug ===');
console.log('1. Copy your JWT token from browser localStorage');
console.log('2. Replace YOUR_JWT_TOKEN_HERE with the actual token');
console.log('3. Run this script: node debug-jwt-token.js');
console.log('');

// Replace this with your actual token
const token = 'YOUR_JWT_TOKEN_HERE';

if (token !== 'YOUR_JWT_TOKEN_HERE') {
  console.log('Decoding token...');
  decodeJWT(token);
  
  console.log('\nVerifying token...');
  verifyJWT(token);
} else {
  console.log('Please replace YOUR_JWT_TOKEN_HERE with your actual token');
} 