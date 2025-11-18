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
  
  // Generar datos únicos para evitar conflictos
  const timestamp = Date.now();
  const uniqueEmail = `test${timestamp}@example.com`;
  const uniqueUsername = 'user' + timestamp;
  
  // Test 1: Registro exitoso
  const registerResult = await testRegister(
    'Registro exitoso',
    { username: uniqueUsername, email: uniqueEmail, password: 'password123' },
    201
  );
  results.push(registerResult);
  
  // Test 2: Email duplicado (usar el mismo email del test 1)
  results.push(await testRegister(
    'Email duplicado',
    { username: 'anotheruser' + timestamp, email: uniqueEmail, password: 'password123' },
    400
  ));
  
  // Test 3: Username duplicado (usar el mismo username del test 1)
  results.push(await testRegister(
    'Username duplicado',
    { username: uniqueUsername, email: `nuevo${timestamp}@example.com`, password: 'password123' },
    400
  ));
  
  // Test 4: Password muy corto
  results.push(await testRegister(
    'Password corto',
    { username: 'user5' + timestamp, email: `user5${timestamp}@example.com`, password: 'short' },
    400
  ));
  
  // Test 5: Email inválido
  results.push(await testRegister(
    'Email inválido',
    { username: 'user6' + timestamp, email: 'emailinvalido', password: 'password123' },
    400
  ));
  
  // Test 6: Username muy corto
  results.push(await testRegister(
    'Username corto',
    { username: 'ab', email: `user7${timestamp}@example.com`, password: 'password123' },
    400
  ));
  
  // Test 7: Sin campos
  results.push(await testRegister(
    'Campos faltantes',
    { email: `user8${timestamp}@example.com` },
    400
  ));
  
  return results;
}

module.exports = { runTests };
