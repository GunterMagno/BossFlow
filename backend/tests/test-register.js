// Test para el endpoint de registro
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
  
  // Generar email único para evitar conflictos
  const uniqueEmail = `test${Date.now()}@example.com`;
  
  // Test 1: Registro exitoso
  results.push(await testRegister(
    'Registro exitoso',
    { username: 'newuser' + Date.now(), email: uniqueEmail, password: 'password123' },
    201
  ));
  
  // Test 2: Email duplicado
  results.push(await testRegister(
    'Email duplicado',
    { username: 'anotheruser', email: 'test@example.com', password: 'password123' },
    400
  ));
  
  // Test 3: Username duplicado
  results.push(await testRegister(
    'Username duplicado',
    { username: 'testuser', email: 'nuevo@example.com', password: 'password123' },
    400
  ));
  
  // Test 4: Password muy corto
  results.push(await testRegister(
    'Password corto',
    { username: 'user5', email: 'user5@example.com', password: 'short' },
    400
  ));
  
  // Test 5: Email inválido
  results.push(await testRegister(
    'Email inválido',
    { username: 'user6', email: 'emailinvalido', password: 'password123' },
    400
  ));
  
  // Test 6: Username muy corto
  results.push(await testRegister(
    'Username corto',
    { username: 'ab', email: 'user7@example.com', password: 'password123' },
    400
  ));
  
  // Test 7: Sin campos
  results.push(await testRegister(
    'Campos faltantes',
    { email: 'user8@example.com' },
    400
  ));
  
  return results;
}

module.exports = { runTests };
