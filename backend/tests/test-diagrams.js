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

// Test para eliminar diagrama (DELETE)
function testDeleteDiagram(testName, diagramId, token, expectedStatus) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/diagrams/${diagramId}`,
      method: 'DELETE',
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

    // ========== TESTS DE DELETE /api/diagrams/:id ==========

    // Crear un diagrama para eliminar
    const timestamp3 = Date.now();
    const createResponse = await testCreateDiagram(
      'Setup DELETE: Crear diagrama',
      {
        title: `DELETE Test ${timestamp3}`,
        description: 'Diagrama para eliminar',
        nodes: [],
        edges: []
      },
      authToken,
      201
    );

    const diagramIdToDelete = createResponse.data?.diagram?.id;

    if (diagramIdToDelete) {
      // Test 12: DELETE diagrama con token válido (owner)
      const deleteTest = await testDeleteDiagram('DELETE diagrama propio', diagramIdToDelete, authToken, 200);
      results.push(deleteTest);

      // Verificar mensaje de confirmación
      if (deleteTest.passed && deleteTest.data) {
        const hasMessage = deleteTest.data.message === 'Diagrama eliminado exitosamente';
        results.push({
          testName: 'DELETE confirmación mensaje',
          passed: hasMessage,
          status: hasMessage ? 200 : 'FAIL',
          expectedStatus: 200
        });
      }

      // Test 13: Verificar que se eliminó de la BD (GET no debe encontrarlo)
      const verifyDeletedTest = await testGetDiagrams('Verificar eliminación de BD', authToken, 200);
      if (verifyDeletedTest.passed && verifyDeletedTest.data) {
        const diagrams = verifyDeletedTest.data.diagrams;
        const notFound = !diagrams.some(d => d.id === diagramIdToDelete);
        results.push({
          testName: 'DELETE verificar eliminación BD',
          passed: notFound,
          status: notFound ? 200 : 'FAIL',
          expectedStatus: 200
        });
      }
    } else {
      results.push({
        testName: 'DELETE diagrama propio',
        passed: false,
        status: 'SETUP_ERROR',
        expectedStatus: 200,
        error: 'No se pudo obtener ID del diagrama creado. Response: ' + JSON.stringify(createResponse)
      });
    }

    // Test 14: DELETE sin token
    const createResponse2 = await testCreateDiagram(
      'Setup DELETE: Diagrama 2',
      {
        title: `DELETE Test 2 ${Date.now()}`,
        description: 'Diagrama para test sin token',
        nodes: [],
        edges: []
      },
      authToken,
      201
    );

    if (createResponse2.data?.diagram?.id) {
      results.push(await testDeleteDiagram(
        'DELETE sin token',
        createResponse2.data.diagram.id,
        null,
        401
      ));
    } else {
      results.push({
        testName: 'DELETE sin token',
        passed: false,
        status: 'SETUP_ERROR',
        expectedStatus: 401,
        error: 'No se pudo obtener ID del diagrama'
      });
    }

    // Test 15: DELETE con token inválido
    const createResponse3 = await testCreateDiagram(
      'Setup DELETE: Diagrama 3',
      {
        title: `DELETE Test 3 ${Date.now()}`,
        description: 'Diagrama para test token inválido',
        nodes: [],
        edges: []
      },
      authToken,
      201
    );

    if (createResponse3.data?.diagram?.id) {
      results.push(await testDeleteDiagram(
        'DELETE token inválido',
        createResponse3.data.diagram.id,
        'token_invalido_123',
        401
      ));
    } else {
      results.push({
        testName: 'DELETE token inválido',
        passed: false,
        status: 'SETUP_ERROR',
        expectedStatus: 401,
        error: 'No se pudo obtener ID del diagrama'
      });
    }

    // Test 16: DELETE diagrama de otro usuario (verificar ownership)
    const otherUserToken = await registerAndLogin();
    const otherUserDiagram = await testCreateDiagram(
      'Setup DELETE: Diagrama otro usuario',
      {
        title: `DELETE Test Other User ${Date.now()}`,
        description: 'Diagrama de otro usuario',
        nodes: [],
        edges: []
      },
      otherUserToken,
      201
    );

    if (otherUserDiagram.data?.diagram?.id) {
      // Intentar eliminar el diagrama de otro usuario con el primer token
      const unauthorizedDelete = await testDeleteDiagram(
        'DELETE diagrama ajeno (ownership)',
        otherUserDiagram.data.diagram.id,
        authToken,
        404
      );
      results.push(unauthorizedDelete);

      // Verificar que el diagrama sigue existiendo
      const verifyStillExists = await testGetDiagrams('Verificar diagrama no eliminado', otherUserToken, 200);
      if (verifyStillExists.passed && verifyStillExists.data) {
        const diagrams = verifyStillExists.data.diagrams;
        const stillExists = diagrams.some(d => d.id === otherUserDiagram.data.diagram.id);
        results.push({
          testName: 'DELETE ownership verificado',
          passed: stillExists,
          status: stillExists ? 200 : 'FAIL',
          expectedStatus: 200
        });
      }
    }

    // Test 17: DELETE con ID inexistente
    results.push(await testDeleteDiagram(
      'DELETE ID inexistente',
      '507f1f77bcf86cd799439011', // ObjectId válido pero inexistente
      authToken,
      404
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
