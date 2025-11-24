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
        let parsedData = null;
        try {
          parsedData = JSON.parse(responseData);
        } catch (e) {}
        resolve({ testName, passed, status: res.statusCode, expectedStatus, data: parsedData });
      });
    });

    req.on('error', (error) => {
      reject({ testName, passed: false, error: error.message });
    });

    req.write(data);
    req.end();
  });
}

// Test para obtener diagramas (GET)
function testGetDiagrams(testName, token, expectedStatus) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/diagrams',
      method: 'GET',
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
        let parsedData = null;
        try {
          parsedData = JSON.parse(responseData);
        } catch (e) {
          // Ignorar error de parsing
        }
        resolve({ 
          testName, 
          passed, 
          status: res.statusCode, 
          expectedStatus,
          data: parsedData
        });
      });
    });

    req.on('error', (error) => {
      reject({ testName, passed: false, error: error.message });
    });

    req.end();
  });
}

// Test para obtener diagrama por ID (GET by ID)
function testGetDiagramById(testName, diagramId, token, expectedStatus) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/diagrams/${diagramId}`,
      method: 'GET',
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
        let parsedData = null;
        try {
          parsedData = JSON.parse(responseData);
        } catch (e) {}
        resolve({ 
          testName, 
          passed, 
          status: res.statusCode, 
          expectedStatus,
          data: parsedData
        });
      });
    });

    req.on('error', (error) => {
      reject({ testName, passed: false, error: error.message });
    });

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

    // Test 1: Crear diagrama exitoso con nodes y edges
    const createTest = await testCreateDiagram(
      'Crear diagrama con nodes y edges',
      {
        title: `Diagrama Test ${timestamp}`,
        description: 'Descripción de prueba',
        nodes: [
          { id: 'node-1', type: 'start', position: { x: 100, y: 100 }, data: { label: 'Inicio' } },
          { id: 'node-2', type: 'activity', position: { x: 300, y: 100 }, data: { label: 'Proceso' } }
        ],
        edges: [
          { id: 'edge-1', source: 'node-1', target: 'node-2' }
        ]
      },
      authToken,
      201
    );
    results.push(createTest);

    // Verificar que se guardaron correctamente los nodes y edges
    if (createTest.passed && createTest.data && createTest.data.diagram) {
      const diagram = createTest.data.diagram;
      const nodesValid = diagram.nodes && diagram.nodes.length === 2 &&
                        diagram.nodes[0].id === 'node-1' &&
                        diagram.nodes[0].type === 'start' &&
                        diagram.nodes[0].position.x === 100 &&
                        diagram.nodes[0].position.y === 100 &&
                        diagram.nodes[0].data.label === 'Inicio';
      
      const edgesValid = diagram.edges && diagram.edges.length === 1 &&
                        diagram.edges[0].id === 'edge-1' &&
                        diagram.edges[0].source === 'node-1' &&
                        diagram.edges[0].target === 'node-2';
      
      results.push({
        testName: 'Verificar estructura nodes guardada',
        passed: nodesValid,
        status: nodesValid ? 200 : 'FAIL',
        expectedStatus: 200
      });

      results.push({
        testName: 'Verificar estructura edges guardada',
        passed: edgesValid,
        status: edgesValid ? 200 : 'FAIL',
        expectedStatus: 200
      });
    }

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

    // Test 2.5: Crear diagrama con nodes sin campos requeridos
    results.push(await testCreateDiagram(
      'Nodes sin id',
      {
        title: `Test nodes invalidos ${Date.now()}`,
        description: 'Nodes sin id',
        nodes: [{ type: 'start', position: { x: 0, y: 0 } }],
        edges: []
      },
      authToken,
      400
    ));

    results.push(await testCreateDiagram(
      'Nodes sin type',
      {
        title: `Test nodes invalidos 2 ${Date.now()}`,
        description: 'Nodes sin type',
        nodes: [{ id: 'node-1', position: { x: 0, y: 0 } }],
        edges: []
      },
      authToken,
      400
    ));

    results.push(await testCreateDiagram(
      'Nodes sin position',
      {
        title: `Test nodes invalidos 3 ${Date.now()}`,
        description: 'Nodes sin position',
        nodes: [{ id: 'node-1', type: 'start' }],
        edges: []
      },
      authToken,
      400
    ));

    // Test 2.6: Crear diagrama con edges sin campos requeridos
    results.push(await testCreateDiagram(
      'Edges sin id',
      {
        title: `Test edges invalidos ${Date.now()}`,
        description: 'Edges sin id',
        nodes: [],
        edges: [{ source: 'a', target: 'b' }]
      },
      authToken,
      400
    ));

    results.push(await testCreateDiagram(
      'Edges sin source',
      {
        title: `Test edges invalidos 2 ${Date.now()}`,
        description: 'Edges sin source',
        nodes: [],
        edges: [{ id: 'edge-1', target: 'b' }]
      },
      authToken,
      400
    ));

    results.push(await testCreateDiagram(
      'Edges sin target',
      {
        title: `Test edges invalidos 3 ${Date.now()}`,
        description: 'Edges sin target',
        nodes: [],
        edges: [{ id: 'edge-1', source: 'a' }]
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

    // ========== TESTS DE GET /api/diagrams ==========
    
    // Crear varios diagramas para probar GET
    const timestamp2 = Date.now();
    await testCreateDiagram(
      'Setup GET: Diagrama 1',
      {
        title: `GET Test 1 ${timestamp2}`,
        description: 'Primer diagrama para GET',
        nodes: [],
        edges: []
      },
      authToken,
      201
    );
    
    // Pequeña espera para asegurar diferente createdAt
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await testCreateDiagram(
      'Setup GET: Diagrama 2',
      {
        title: `GET Test 2 ${timestamp2}`,
        description: 'Segundo diagrama para GET',
        nodes: [],
        edges: []
      },
      authToken,
      201
    );

    await new Promise(resolve => setTimeout(resolve, 100));
    
    await testCreateDiagram(
      'Setup GET: Diagrama 3',
      {
        title: `GET Test 3 ${timestamp2}`,
        description: 'Tercer diagrama para GET',
        nodes: [],
        edges: []
      },
      authToken,
      201
    );

    // Test 7: GET diagramas con token válido
    const getTest = await testGetDiagrams('GET diagramas con token', authToken, 200);
    results.push(getTest);
    
    if (getTest.passed && getTest.data && getTest.data.diagrams) {
      const diagrams = getTest.data.diagrams;
      
      // Test 8: Verificar ordenamiento (más reciente primero)
      if (diagrams.length >= 2) {
        const isOrdered = new Date(diagrams[0].createdAt) >= new Date(diagrams[1].createdAt);
        results.push({
          testName: 'GET ordenamiento correcto',
          passed: isOrdered,
          status: isOrdered ? 200 : 'FAIL',
          expectedStatus: 200
        });
      }
      
      // Test 9: Verificar que todos tienen los campos necesarios
      const hasAllFields = diagrams.every(d => 
        d.id && d.title && d.createdAt && d.updatedAt && 
        Array.isArray(d.nodes) && Array.isArray(d.edges)
      );
      results.push({
        testName: 'GET campos requeridos',
        passed: hasAllFields,
        status: hasAllFields ? 200 : 'FAIL',
        expectedStatus: 200
      });
    }

    // Test 10: GET diagramas sin token
    results.push(await testGetDiagrams('GET sin token', null, 401));

    // Test 11: GET diagramas con token inválido
    results.push(await testGetDiagrams('GET token inválido', 'token_invalido_123', 401));

    // Test 12: Verificar aislamiento de datos (otro usuario no ve estos diagramas)
    const otherUserToken = await registerAndLogin();
    const isolationTest = await testGetDiagrams('GET aislamiento datos', otherUserToken, 200);
    results.push(isolationTest);
    
    if (isolationTest.passed && isolationTest.data && isolationTest.data.diagrams) {
      // Crear un diagrama para el nuevo usuario
      await testCreateDiagram(
        'Setup: Diagrama usuario nuevo',
        {
          title: `User2 Diagram ${Date.now()}`,
          description: 'Diagrama de usuario 2',
          nodes: [],
          edges: []
        },
        otherUserToken,
        201
      );
      
      // Verificar que solo ve 1 diagrama (el suyo)
      const otherUserDiagrams = await testGetDiagrams('GET solo propios', otherUserToken, 200);
      if (otherUserDiagrams.passed && otherUserDiagrams.data) {
        const onlyOwn = otherUserDiagrams.data.diagrams.length === 1;
        results.push({
          testName: 'GET solo diagramas propios',
          passed: onlyOwn,
          status: 200,
          expectedStatus: 200
        });
      }
    }

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
