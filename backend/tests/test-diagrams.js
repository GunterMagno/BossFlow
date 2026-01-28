// Tests for the diagrams endpoint
const http = require('http');

// Helper to register a user and obtain a token
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
            reject('Could not obtain token');
          }
        } catch (error) {
          reject('Error parsing response: ' + error.message);
        }
      });
    });

    registerReq.on('error', reject);
    registerReq.write(registerData);
    registerReq.end();
  });
}

// Test to create a diagram
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

    // Only add Authorization header if a token is provided
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
          // Ignore parsing error
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

// Test to get a diagram by ID (GET by ID)
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

// Test to update a diagram (PUT)
function testUpdateDiagram(testName, diagramId, updateData, token, expectedStatus) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(updateData);

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/diagrams/${diagramId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
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

    req.write(data);
    req.end();
  });
}

async function runTests() {
  const results = [];
  
  try {
    // Obtain authentication token
    const authToken = await registerAndLogin();

    // Generate timestamp for unique titles
    const timestamp = Date.now();

    // Test 1: Create diagram successful with nodes and edges
    const createTest = await testCreateDiagram(
      'Create diagram with nodes and edges',
      {
        title: `Diagram Test ${timestamp}`,
        description: 'Test description',
        nodes: [
          { id: 'node-1', type: 'start', position: { x: 100, y: 100 }, data: { label: 'Start' } },
          { id: 'node-2', type: 'activity', position: { x: 300, y: 100 }, data: { label: 'Process' } }
        ],
        edges: [
          { id: 'edge-1', source: 'node-1', target: 'node-2' }
        ]
      },
      authToken,
      201
    );
    results.push(createTest);

    // Verify nodes and edges were saved correctly
    if (createTest.passed && createTest.data && createTest.data.diagram) {
      const diagram = createTest.data.diagram;
      const nodesValid = diagram.nodes && diagram.nodes.length === 2 &&
                        diagram.nodes[0].id === 'node-1' &&
                        diagram.nodes[0].type === 'start' &&
                        diagram.nodes[0].position.x === 100 &&
                        diagram.nodes[0].position.y === 100 &&
                        diagram.nodes[0].data.label === 'Start';
      
      const edgesValid = diagram.edges && diagram.edges.length === 1 &&
                        diagram.edges[0].id === 'edge-1' &&
                        diagram.edges[0].source === 'node-1' &&
                        diagram.edges[0].target === 'node-2';
      
      results.push({
        testName: 'Verify saved nodes structure',
        passed: nodesValid,
        status: nodesValid ? 200 : 'FAIL',
        expectedStatus: 200
      });

      results.push({
        testName: 'Verify saved edges structure',
        passed: edgesValid,
        status: edgesValid ? 200 : 'FAIL',
        expectedStatus: 200
      });
    }

    // Test 2: Create diagram without title
    results.push(await testCreateDiagram(
      'Without title',
      {
        description: 'No title',
        nodes: [],
        edges: []
      },
      authToken,
      400
    ));

    // Test 2.5: Create diagram with nodes missing required fields
    results.push(await testCreateDiagram(
      'Nodes missing id',
      {
        title: `Test nodes invalid ${Date.now()}`,
        description: 'Nodes missing id',
        nodes: [{ type: 'start', position: { x: 0, y: 0 } }],
        edges: []
      },
      authToken,
      400
    ));

    results.push(await testCreateDiagram(
      'Nodes missing type',
      {
        title: `Test nodes invalid 2 ${Date.now()}`,
        description: 'Nodes missing type',
        nodes: [{ id: 'node-1', position: { x: 0, y: 0 } }],
        edges: []
      },
      authToken,
      400
    ));

    results.push(await testCreateDiagram(
      'Nodes missing position',
      {
        title: `Test nodes invalid 3 ${Date.now()}`,
        description: 'Nodes missing position',
        nodes: [{ id: 'node-1', type: 'start' }],
        edges: []
      },
      authToken,
      400
    ));

    // Test 2.6: Create diagram with edges missing required fields
    results.push(await testCreateDiagram(
      'Edges missing id',
      {
        title: `Test edges invalid ${Date.now()}`,
        description: 'Edges missing id',
        nodes: [],
        edges: [{ source: 'a', target: 'b' }]
      },
      authToken,
      400
    ));

    results.push(await testCreateDiagram(
      'Edges missing source',
      {
        title: `Test edges invalid 2 ${Date.now()}`,
        description: 'Edges missing source',
        nodes: [],
        edges: [{ id: 'edge-1', target: 'b' }]
      },
      authToken,
      400
    ));

    results.push(await testCreateDiagram(
      'Edges missing target',
      {
        title: `Test edges invalid 3 ${Date.now()}`,
        description: 'Edges missing target',
        nodes: [],
        edges: [{ id: 'edge-1', source: 'a' }]
      },
      authToken,
      400
    ));

    // Test 3: Create diagram with a very short title
    results.push(await testCreateDiagram(
      'Title too short',
      {
        title: 'AB',
        description: 'Title with only 2 characters',
        nodes: [],
        edges: []
      },
      authToken,
      400
    ));

    // Test 4: Create diagram without token
    results.push(await testCreateDiagram(
      'Without authentication',
      {
        title: 'Diagram without token',
        description: 'Should fail',
        nodes: [],
        edges: []
      },
      null,
      401
    ));

    // Test 5: Create diagram with invalid token
    results.push(await testCreateDiagram(
      'Invalid token',
      {
        title: 'Diagram with invalid token',
        description: 'Should fail',
        nodes: [],
        edges: []
      },
      'invalid_token_12345',
      401
    ));

    // Test 6: Create diagram with duplicate title
    const duplicateTitle = `Duplicate Diagram ${Date.now()}`;
    
    // First create the original diagram
    await testCreateDiagram(
      'Create original diagram',
      {
        title: duplicateTitle,
        description: 'Original',
        nodes: [],
        edges: []
      },
      authToken,
      201
    );

    // Attempt to create a diagram with the same title
    results.push(await testCreateDiagram(
      'Duplicate title',
      {
        title: duplicateTitle,
        description: 'Duplicate',
        nodes: [],
        edges: []
      },
      authToken,
      409
    ));

    // ========== TESTS FOR GET /api/diagrams ==========

    // Create several diagrams to test GET
    const timestamp2 = Date.now();
    await testCreateDiagram(
      'Setup GET: Diagram 1',
      {
        title: `GET Test 1 ${timestamp2}`,
        description: 'First diagram for GET',
        nodes: [],
        edges: []
      },
      authToken,
      201
    );
    
    // Small wait to ensure different createdAt timestamps
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await testCreateDiagram(
      'Setup GET: Diagram 2',
      {
        title: `GET Test 2 ${timestamp2}`,
        description: 'Second diagram for GET',
        nodes: [],
        edges: []
      },
      authToken,
      201
    );

    await new Promise(resolve => setTimeout(resolve, 100));
    
    await testCreateDiagram(
      'Setup GET: Diagram 3',
      {
        title: `GET Test 3 ${timestamp2}`,
        description: 'Third diagram for GET',
        nodes: [],
        edges: []
      },
      authToken,
      201
    );

    // Test 7: GET diagrams with valid token
    const getTest = await testGetDiagrams('GET diagrams with token', authToken, 200);
    results.push(getTest);
    
    if (getTest.passed && getTest.data && getTest.data.diagrams) {
      const diagrams = getTest.data.diagrams;
      
      // Test 8: Verificar ordenamiento (más reciente primero)
      if (diagrams.length >= 2) {
        const isOrdered = new Date(diagrams[0].createdAt) >= new Date(diagrams[1].createdAt);
        results.push({
          testName: 'GET correct ordering',
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
        testName: 'GET required fields',
        passed: hasAllFields,
        status: hasAllFields ? 200 : 'FAIL',
        expectedStatus: 200
      });
    }

    // Test 10: GET diagrams without token
    results.push(await testGetDiagrams('GET without token', null, 401));

    // Test 11: GET diagrams with invalid token
    results.push(await testGetDiagrams('GET invalid token', 'invalid_token_123', 401));

    // Test 12: Verify data isolation (another user should not see these diagrams)
    const otherUserToken = await registerAndLogin();
    const isolationTest = await testGetDiagrams('GET data isolation', otherUserToken, 200);
    results.push(isolationTest);
    
    if (isolationTest.passed && isolationTest.data && isolationTest.data.diagrams) {
      // Create a diagram for the new user
      await testCreateDiagram(
        'Setup: New user diagram',
        {
          title: `User2 Diagram ${Date.now()}`,
          description: 'User 2 diagram',
          nodes: [],
          edges: []
        },
        otherUserToken,
        201
      );
      
      // Verify they only see 1 diagram (their own)
      const otherUserDiagrams = await testGetDiagrams('GET only own', otherUserToken, 200);
      if (otherUserDiagrams.passed && otherUserDiagrams.data) {
        const onlyOwn = otherUserDiagrams.data.diagrams.length === 1;
        results.push({
          testName: 'GET only own diagrams',
          passed: onlyOwn,
          status: 200,
          expectedStatus: 200
        });
      }
    }

    // ========== TESTS FOR PUT /api/diagrams/:id ==========
    
    // Create diagram for update tests
    const updateTest = await testCreateDiagram(
      'Setup PUT: Create base diagram',
      {
        title: `Diagram To Update ${Date.now()}`,
        description: 'Original description',
        nodes: [{ id: 'n1', type: 'start', position: { x: 0, y: 0 }, data: {} }],
        edges: []
      },
      authToken,
      201
    );

    let diagramIdToUpdate = null;
    if (updateTest.passed && updateTest.data && updateTest.data.diagram) {
      diagramIdToUpdate = updateTest.data.diagram.id;

      // Test PUT-1: Update diagram successfully
      const putTest1 = await testUpdateDiagram(
        'PUT successful update',
        diagramIdToUpdate,
        {
          title: `Diagram Updated ${Date.now()}`,
          description: 'Updated description',
          nodes: [
            { id: 'n1', type: 'start', position: { x: 100, y: 100 }, data: { label: 'Start' } },
            { id: 'n2', type: 'end', position: { x: 200, y: 200 }, data: { label: 'End' } }
          ],
          edges: [
            { id: 'e1', source: 'n1', target: 'n2' }
          ]
        },
        authToken,
        200
      );
      results.push(putTest1);

      // Verificar que se actualizaron nodes y edges correctamente
      if (putTest1.passed && putTest1.data && putTest1.data.diagram) {
        const updated = putTest1.data.diagram;
        const nodesUpdated = updated.nodes.length === 2 &&
                            updated.nodes[1].id === 'n2' &&
                            updated.nodes[1].position.x === 200;
        
        const edgesUpdated = updated.edges.length === 1 &&
                            updated.edges[0].source === 'n1' &&
                            updated.edges[0].target === 'n2';

        results.push({
          testName: 'PUT nodes updated correctly',
          passed: nodesUpdated,
          status: nodesUpdated ? 200 : 'FAIL',
          expectedStatus: 200
        });

        results.push({
          testName: 'PUT edges updated correctly',
          passed: edgesUpdated,
          status: edgesUpdated ? 200 : 'FAIL',
          expectedStatus: 200
        });
      }

      // Test PUT-2: Update title only
      results.push(await testUpdateDiagram(
        'PUT title only',
        diagramIdToUpdate,
        { title: `Title Only ${Date.now()}` },
        authToken,
        200
      ));

      // Test PUT-3: Update nodes only (maintaining compatibility with edges)
      results.push(await testUpdateDiagram(
        'PUT nodes only',
        diagramIdToUpdate,
        { 
          nodes: [
            { id: 'n1', type: 'start', position: { x: 50, y: 50 }, data: {} },
            { id: 'n2', type: 'end', position: { x: 150, y: 150 }, data: {} }
          ]
        },
        authToken,
        200
      ));

      // Test PUT-4: Title too short
      results.push(await testUpdateDiagram(
        'PUT title too short',
        diagramIdToUpdate,
        { title: 'AB' },
        authToken,
        400
      ));

      // Test PUT-5: Nodes with invalid structure
      results.push(await testUpdateDiagram(
        'PUT nodes missing id',
        diagramIdToUpdate,
        { nodes: [{ type: 'start', position: { x: 0, y: 0 } }] },
        authToken,
        400
      ));

      // Test PUT-6: Edges with invalid structure
      results.push(await testUpdateDiagram(
        'PUT edges missing source',
        diagramIdToUpdate,
        { edges: [{ id: 'e1', target: 'n2' }] },
        authToken,
        400
      ));
    }

    // Test PUT-7: Without token
    results.push(await testUpdateDiagram(
      'PUT without token',
      diagramIdToUpdate || 'dummy',
      { title: 'Unauthorized' },
      null,
      401
    ));

    // Test PUT-8: Invalid token
    results.push(await testUpdateDiagram(
      'PUT invalid token',
      diagramIdToUpdate || 'dummy',
      { title: 'Invalid token' },
      'invalid_token_123',
      401
    ));

    // Test PUT-9: Invalid ID
    results.push(await testUpdateDiagram(
      'PUT invalid ID',
      'invalid_id',
      { title: 'Invalid ID' },
      authToken,
      404
    ));

    // Test PUT-10: Another user's diagram
    if (otherUserToken && diagramIdToUpdate) {
      results.push(await testUpdateDiagram(
        'PUT another user diagram',
        diagramIdToUpdate,
        { title: 'Attempting to modify another user\'s diagram' },
        otherUserToken,
        404
      ));
    }

  } catch (error) {
    results.push({ testName: 'Setup error', passed: false, error: error.message });
  }

  return results;
}

// Run tests if this is the main module
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
