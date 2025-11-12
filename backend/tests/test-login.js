// Test para el endpoint de login
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
  
  // Test 1: Login exitoso
  results.push(await testLogin('Login exitoso', 'test@example.com', 'password123', 200));
  
  // Test 2: Email en mayúsculas
  results.push(await testLogin('Email mayúsculas', 'TEST@EXAMPLE.COM', 'password123', 200));
  
  // Test 3: Password incorrecta
  results.push(await testLogin('Password incorrecta', 'test@example.com', 'wrongpass', 401));
  
  // Test 4: Email inexistente
  results.push(await testLogin('Email inexistente', 'noexiste@example.com', 'password123', 401));
  
  // Test 5: Email inválido
  results.push(await testLogin('Email inválido', 'emailinvalido', 'password123', 400));
  
  // Test 6: Sin email
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
      resolve({ testName: 'Sin email', passed, status: res.statusCode, expectedStatus: 400 });
    });
    req.write(data);
    req.end();
  });
  results.push(test6);
  
  // Test 7: Sin password
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
      resolve({ testName: 'Sin password', passed, status: res.statusCode, expectedStatus: 400 });
    });
    req.write(data);
    req.end();
  });
  results.push(test7);
  
  return results;
}

module.exports = { runTests };
