/**
 * Tests de validación de estructura de diagramas
 * Prueba las validaciones de nodos y edges
 */

const http = require('http');

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function testValidation(testName, body, token, expectedStatus) {
  try {
    const response = await makeRequest('POST', '/diagrams', body, token);
    
    return {
      testName,
      passed: response.status === expectedStatus,
      status: response.status,
      expectedStatus,
      response: response.body
    };
  } catch (error) {
    return {
      testName,
      passed: false,
      status: 'ERROR',
      expectedStatus,
      error: error.message
    };
  }
}

async function runTests() {
  const results = [];

  // Obtener token de autenticación
  let authToken = '';
  try {
    const loginResponse = await makeRequest('POST', '/auth/login', {
      email: 'validationtest@test.com',
      password: 'password123'
    });
    
    if (loginResponse.status === 200) {
      const parsed = JSON.parse(loginResponse.body);
      authToken = parsed.token;
    } else {
      // Crear usuario si no existe
      await makeRequest('POST', '/auth/register', {
        username: 'validationtest',
        email: 'validationtest@test.com',
        password: 'password123'
      });
      
      const retry = await makeRequest('POST', '/auth/login', {
        email: 'validationtest@test.com',
        password: 'password123'
      });
      
      const parsed = JSON.parse(retry.body);
      authToken = parsed.token;
    }
  } catch (error) {
    console.error('Error obteniendo token:', error.message);
  }

  // ========================================
  // TESTS DE VALIDACIÓN DE NODOS
  // ========================================

  // Test 1: Nodo sin campo "id"
  results.push(await testValidation(
    'Validación: Nodo sin id',
    {
      title: `Test sin ID ${Date.now()}`,
      nodes: [{
        type: 'default',
        position: { x: 100, y: 200 },
        data: {}
      }],
      edges: []
    },
    authToken,
    400
  ));

  // Test 2: Nodo sin campo "type"
  results.push(await testValidation(
    'Validación: Nodo sin type',
    {
      title: `Test sin type ${Date.now()}`,
      nodes: [{
        id: '1',
        position: { x: 100, y: 200 },
        data: {}
      }],
      edges: []
    },
    authToken,
    400
  ));

  // Test 3: Nodo sin campo "position"
  results.push(await testValidation(
    'Validación: Nodo sin position',
    {
      title: `Test sin position ${Date.now()}`,
      nodes: [{
        id: '1',
        type: 'default',
        data: {}
      }],
      edges: []
    },
    authToken,
    400
  ));

  // Test 4: Nodo sin "position.x"
  results.push(await testValidation(
    'Validación: Nodo sin position.x',
    {
      title: `Test sin x ${Date.now()}`,
      nodes: [{
        id: '1',
        type: 'default',
        position: { y: 200 },
        data: {}
      }],
      edges: []
    },
    authToken,
    400
  ));

  // Test 5: Nodo sin "position.y"
  results.push(await testValidation(
    'Validación: Nodo sin position.y',
    {
      title: `Test sin y ${Date.now()}`,
      nodes: [{
        id: '1',
        type: 'default',
        position: { x: 100 },
        data: {}
      }],
      edges: []
    },
    authToken,
    400
  ));

  // Test 6: Nodo sin campo "data"
  results.push(await testValidation(
    'Validación: Nodo sin data',
    {
      title: `Test sin data ${Date.now()}`,
      nodes: [{
        id: '1',
        type: 'default',
        position: { x: 100, y: 200 }
      }],
      edges: []
    },
    authToken,
    400
  ));

  // Test 7: Nodos con IDs duplicados
  results.push(await testValidation(
    'Validación: IDs duplicados',
    {
      title: `Test IDs duplicados ${Date.now()}`,
      nodes: [
        { id: '1', type: 'default', position: { x: 0, y: 0 }, data: {} },
        { id: '1', type: 'default', position: { x: 100, y: 100 }, data: {} }
      ],
      edges: []
    },
    authToken,
    400
  ));

  // ========================================
  // TESTS DE VALIDACIÓN DE EDGES
  // ========================================

  // Test 8: Edge sin campo "id"
  results.push(await testValidation(
    'Validación: Edge sin id',
    {
      title: `Test edge sin id ${Date.now()}`,
      nodes: [
        { id: '1', type: 'default', position: { x: 0, y: 0 }, data: {} },
        { id: '2', type: 'default', position: { x: 100, y: 100 }, data: {} }
      ],
      edges: [{
        source: '1',
        target: '2'
      }]
    },
    authToken,
    400
  ));

  // Test 9: Edge sin campo "source"
  results.push(await testValidation(
    'Validación: Edge sin source',
    {
      title: `Test edge sin source ${Date.now()}`,
      nodes: [
        { id: '1', type: 'default', position: { x: 0, y: 0 }, data: {} },
        { id: '2', type: 'default', position: { x: 100, y: 100 }, data: {} }
      ],
      edges: [{
        id: 'e1-2',
        target: '2'
      }]
    },
    authToken,
    400
  ));

  // Test 10: Edge sin campo "target"
  results.push(await testValidation(
    'Validación: Edge sin target',
    {
      title: `Test edge sin target ${Date.now()}`,
      nodes: [
        { id: '1', type: 'default', position: { x: 0, y: 0 }, data: {} },
        { id: '2', type: 'default', position: { x: 100, y: 100 }, data: {} }
      ],
      edges: [{
        id: 'e1-2',
        source: '1'
      }]
    },
    authToken,
    400
  ));

  // Test 11: Edge con source inexistente
  results.push(await testValidation(
    'Validación: Edge source inexistente',
    {
      title: `Test source inexistente ${Date.now()}`,
      nodes: [
        { id: '1', type: 'default', position: { x: 0, y: 0 }, data: {} }
      ],
      edges: [{
        id: 'e1-2',
        source: '999',
        target: '1'
      }]
    },
    authToken,
    400
  ));

  // Test 12: Edge con target inexistente
  results.push(await testValidation(
    'Validación: Edge target inexistente',
    {
      title: `Test target inexistente ${Date.now()}`,
      nodes: [
        { id: '1', type: 'default', position: { x: 0, y: 0 }, data: {} }
      ],
      edges: [{
        id: 'e1-2',
        source: '1',
        target: '999'
      }]
    },
    authToken,
    400
  ));

  // Test 13: Edge con source === target (self-loop)
  results.push(await testValidation(
    'Validación: Edge self-loop',
    {
      title: `Test self-loop ${Date.now()}`,
      nodes: [
        { id: '1', type: 'default', position: { x: 0, y: 0 }, data: {} }
      ],
      edges: [{
        id: 'e1-1',
        source: '1',
        target: '1'
      }]
    },
    authToken,
    400
  ));

  // Test 14: Edges con IDs duplicados
  results.push(await testValidation(
    'Validación: Edge IDs duplicados',
    {
      title: `Test edge IDs duplicados ${Date.now()}`,
      nodes: [
        { id: '1', type: 'default', position: { x: 0, y: 0 }, data: {} },
        { id: '2', type: 'default', position: { x: 100, y: 100 }, data: {} },
        { id: '3', type: 'default', position: { x: 200, y: 200 }, data: {} }
      ],
      edges: [
        { id: 'e1', source: '1', target: '2' },
        { id: 'e1', source: '2', target: '3' }
      ]
    },
    authToken,
    400
  ));

  // ========================================
  // TEST DE DIAGRAMA VÁLIDO
  // ========================================

  // Test 15: Diagrama válido completo
  results.push(await testValidation(
    'Validación: Diagrama válido',
    {
      title: `Diagrama válido ${Date.now()}`,
      description: 'Diagrama con estructura correcta',
      nodes: [
        { id: 'n1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Inicio' } },
        { id: 'n2', type: 'default', position: { x: 100, y: 100 }, data: { label: 'Proceso' } },
        { id: 'n3', type: 'output', position: { x: 200, y: 200 }, data: { label: 'Fin' } }
      ],
      edges: [
        { id: 'e1-2', source: 'n1', target: 'n2' },
        { id: 'e2-3', source: 'n2', target: 'n3' }
      ]
    },
    authToken,
    201
  ));

  return results;
}

module.exports = { runTests };
