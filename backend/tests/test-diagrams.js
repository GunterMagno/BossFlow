// Test para el endpoint de creación de diagramas
const http = require('http');

// Helper para registrar usuario y obtener token
function registerAndLogin() {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const userData = {
      username: `diagramuser${timestamp}`,
      email: `diagram${timestamp}@example.com`,
      password: 'password123'
    };

    const registerData = JSON.stringify(userData);
    const registerOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(registerData)
      }
    };

    const registerReq = http.request(registerOptions, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          if (response.token) {
            resolve(response.token);
          } else {
            reject('No se pudo obtener token');
          }
        } catch (error) {
          reject('Error al parsear respuesta: ' + error.message);
        }
      });
    });

    registerReq.on('error', reject);
    registerReq.write(registerData);
    registerReq.end();
  });
}

// Test para crear diagrama
function testCreateDiagram(testName, diagramData, token, expectedStatus) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(diagramData);

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/diagrams',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    // Solo añadir header de autorización si hay token
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
  
  try {
    // Obtener token de autenticación
    const authToken = await registerAndLogin();

    // Generar timestamp para títulos únicos
    const timestamp = Date.now();

    // Test 1: Crear diagrama exitoso
    results.push(await testCreateDiagram(
      'Crear diagrama exitoso',
      {
        title: `Diagrama Test ${timestamp}`,
        description: 'Descripción de prueba',
        nodes: [{ id: '1', type: 'default', position: { x: 0, y: 0 } }],
        edges: []
      },
      authToken,
      201
    ));

    // Test 2: Crear diagrama sin título
    results.push(await testCreateDiagram(
      'Sin título',
      {
        description: 'Sin título',
        nodes: [],
        edges: []
      },
      authToken,
      400
    ));

    // Test 3: Crear diagrama con título muy corto
    results.push(await testCreateDiagram(
      'Título muy corto',
      {
        title: 'AB',
        description: 'Título de solo 2 caracteres',
        nodes: [],
        edges: []
      },
      authToken,
      400
    ));

    // Test 4: Crear diagrama sin token
    results.push(await testCreateDiagram(
      'Sin autenticación',
      {
        title: 'Diagrama sin token',
        description: 'Debe fallar',
        nodes: [],
        edges: []
      },
      null,
      401
    ));

    // Test 5: Crear diagrama con token inválido
    results.push(await testCreateDiagram(
      'Token inválido',
      {
        title: 'Diagrama token inválido',
        description: 'Debe fallar',
        nodes: [],
        edges: []
      },
      'token_invalido_12345',
      401
    ));

    // Test 6: Crear diagrama con título duplicado
    const duplicateTitle = `Diagrama Duplicado ${Date.now()}`;
    
    // Primero crear el diagrama original
    await testCreateDiagram(
      'Crear diagrama original',
      {
        title: duplicateTitle,
        description: 'Original',
        nodes: [],
        edges: []
      },
      authToken,
      201
    );

    // Intentar crear con el mismo título
    results.push(await testCreateDiagram(
      'Título duplicado',
      {
        title: duplicateTitle,
        description: 'Duplicado',
        nodes: [],
        edges: []
      },
      authToken,
      409
    ));

  } catch (error) {
    results.push({ testName: 'Error en setup', passed: false, error: error.message });
  }

  return results;
}

// Ejecutar tests si es el archivo principal
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
