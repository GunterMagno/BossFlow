// Tests for the login endpoint
const http = require('http');

function testLogin(testName, email, password, expectedStatus) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, password });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
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
  
  // First create a user for login tests
  const timestamp = Date.now();
  const testEmail = `logintest${timestamp}@example.com`;
  const testPassword = 'password123';
  
  await new Promise((resolve) => {
    const data = JSON.stringify({ 
      username: 'loginuser' + timestamp, 
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
    const req = http.request(options, () => resolve());
    req.write(data);
    req.end();
  });
  
  // Test 1: Successful login
  results.push(await testLogin('Successful login', testEmail, testPassword, 200));

  // Test 2: Uppercase email (should work due to normalization)
  results.push(await testLogin('Uppercase email', testEmail.toUpperCase(), testPassword, 200));

  // Test 3: Incorrect password
  results.push(await testLogin('Incorrect password', testEmail, 'wrongpass', 401));

  // Test 4: Non-existent email
  results.push(await testLogin('Non-existent email', `noexiste${timestamp}@example.com`, testPassword, 401));

  // Test 5: Invalid email
  results.push(await testLogin('Invalid email', 'emailinvalido', testPassword, 400));

  // Test 6: Missing email
  const test6 = await new Promise((resolve) => {
    const data = JSON.stringify({ password: 'password123' });
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
      const req = http.request(options, (res) => {
      const passed = res.statusCode === 400;
      resolve({ testName: 'Missing email', passed, status: res.statusCode, expectedStatus: 400 });
    });
    req.write(data);
    req.end();
  });
  results.push(test6);
  
  // Test 7: Missing password
  const test7 = await new Promise((resolve) => {
    const data = JSON.stringify({ email: 'test@example.com' });
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    const req = http.request(options, (res) => {
      const passed = res.statusCode === 400;
      resolve({ testName: 'Missing password', passed, status: res.statusCode, expectedStatus: 400 });
    });
    req.write(data);
    req.end();
  });
  results.push(test7);
  
  return results;
}

module.exports = { runTests };
