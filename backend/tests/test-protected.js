// Test para rutas protegidas y logout
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
  
  // Primero crear un usuario y hacer login para obtener un token
  const timestamp = Date.now();
  const testEmail = `protected${timestamp}@example.com`;
  const testPassword = 'password123';
  
  // Registrar usuario
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
          // Ignorar error de parsing
        }
        resolve();
      });
    });
    req.write(data);
    req.end();
  });
  
  // Test 1: Acceder a ruta protegida CON token válido
  results.push(await testProtectedRoute('Perfil con token', '/api/perfil', authToken, 200));
  
  // Test 2: Acceder a ruta protegida SIN token
  results.push(await testProtectedRoute('Perfil sin token', '/api/perfil', null, 401));
  
  // Test 3: Acceder a ruta protegida con token INVÁLIDO
  results.push(await testProtectedRoute('Perfil token inválido', '/api/perfil', 'token_invalido_123', 401));
  
  // Test 4: Logout con token válido
  results.push(await testProtectedRoute('Logout exitoso', '/api/auth/logout', authToken, 200, 'POST'));
  
  // Test 5: Logout sin token
  results.push(await testProtectedRoute('Logout sin token', '/api/auth/logout', null, 401, 'POST'));
  
  return results;
}

module.exports = { runTests };
