// Tests for protected routes and logout
const http = require('http');

function testProtectedRoute(testName, path, token, expectedStatus, method = 'GET') {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {}
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        const passed = res.statusCode === expectedStatus;
        resolve({ testName, passed, status: res.statusCode, expectedStatus, response: responseData });
      });
    });

    req.on('error', (error) => {
      resolve({ testName, passed: false, error: error.message, expectedStatus });
    });

    req.end();
  });
}

async function runTests() {
  const results = [];
  let authToken = null;
  
  // First create a user and login to obtain a token
  const timestamp = Date.now();
  const testEmail = `protected${timestamp}@example.com`;
  const testPassword = 'password123';
  
  // Register user
  await new Promise((resolve) => {
    const data = JSON.stringify({ 
      username: 'protecteduser' + timestamp, 
      email: testEmail, 
      password: testPassword 
    });
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          authToken = parsed.token;
        } catch (e) {
          // Ignore parsing error
        }
        resolve();
      });
    });
    req.write(data);
    req.end();
  });
  
  // Test 1: Access protected route WITH valid token
  results.push(await testProtectedRoute('Profile with token', '/api/perfil', authToken, 200));

  // Test 2: Access protected route WITHOUT token
  results.push(await testProtectedRoute('Profile without token', '/api/perfil', null, 401));

  // Test 3: Access protected route with INVALID token
  results.push(await testProtectedRoute('Profile with invalid token', '/api/perfil', 'invalid_token_123', 401));

  // Test 4: Logout with valid token
  results.push(await testProtectedRoute('Logout successful', '/api/auth/logout', authToken, 200, 'POST'));

  // Test 5: Logout without token
  results.push(await testProtectedRoute('Logout without token', '/api/auth/logout', null, 401, 'POST'));
  
  return results;
}

module.exports = { runTests };
