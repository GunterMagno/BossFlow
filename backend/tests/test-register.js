// Tests for the register endpoint
const http = require('http');

function testRegister(testName, userData, expectedStatus) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(userData);

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
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        const passed = res.statusCode === expectedStatus;
        resolve({ testName, passed, status: res.statusCode, expectedStatus });
      });
    });

    req.on('error', (error) => {
      reject({ testName, passed: false, error: error.message });
    });

    req.write(data);
    req.end();
  });
}

async function runTests() {
  const results = [];
  
  // Generate unique data to avoid conflicts
  const timestamp = Date.now();
  const uniqueEmail = `test${timestamp}@example.com`;
  const uniqueUsername = 'user' + timestamp;
  
  // Test 1: Successful registration
  const registerResult = await testRegister(
    'Successful registration',
    { username: uniqueUsername, email: uniqueEmail, password: 'password123' },
    201
  );
  results.push(registerResult);
  
  // Test 2: Duplicate email (use the same email from test 1)
  results.push(await testRegister(
    'Duplicate email',
    { username: 'anotheruser' + timestamp, email: uniqueEmail, password: 'password123' },
    400
  ));
  
  // Test 3: Duplicate username (use the same username from test 1)
  results.push(await testRegister(
    'Duplicate username',
    { username: uniqueUsername, email: `nuevo${timestamp}@example.com`, password: 'password123' },
    400
  ));
  
  // Test 4: Password too short
  results.push(await testRegister(
    'Password too short',
    { username: 'user5' + timestamp, email: `user5${timestamp}@example.com`, password: 'short' },
    400
  ));
  
  // Test 5: Invalid email
  results.push(await testRegister(
    'Invalid email',
    { username: 'user6' + timestamp, email: 'emailinvalido', password: 'password123' },
    400
  ));
  
  // Test 6: Username too short
  results.push(await testRegister(
    'Username too short',
    { username: 'ab', email: `user7${timestamp}@example.com`, password: 'password123' },
    400
  ));
  
  // Test 7: Missing fields
  results.push(await testRegister(
    'Missing fields',
    { email: `user8${timestamp}@example.com` },
    400
  ));
  
  return results;
}

module.exports = { runTests };
