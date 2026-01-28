/**
 * Diagram structure validation tests
 * Tests nodes and edges validation
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

  // Obtain authentication token
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
      // Create user if it does not exist
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
    console.error('Error obtaining token:', error.message);
  }

  // ========================================
  // NODE VALIDATION TESTS
  // ========================================

  // Test 1: Node missing the "id" field
  results.push(await testValidation(
    'Validation: Node missing id',
    {
      title: `Test missing ID ${Date.now()}`,
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

  // Test 2: Node missing the "type" field
  results.push(await testValidation(
    'Validation: Node missing type',
    {
      title: `Test missing type ${Date.now()}`,
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

  // Test 3: Node missing the "position" field
  results.push(await testValidation(
    'Validation: Node missing position',
    {
      title: `Test missing position ${Date.now()}`,
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

  // Test 4: Node missing "position.x"
  results.push(await testValidation(
    'Validation: Node missing position.x',
    {
      title: `Test missing x ${Date.now()}`,
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

  // Test 5: Node missing "position.y"
  results.push(await testValidation(
    'Validation: Node missing position.y',
    {
      title: `Test missing y ${Date.now()}`,
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

  // Test 6: Node missing the "data" field
  results.push(await testValidation(
    'Validation: Node missing data',
    {
      title: `Test missing data ${Date.now()}`,
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

  // Test 7: Nodes with duplicate IDs
  results.push(await testValidation(
    'Validation: Duplicate IDs',
    {
      title: `Test duplicate IDs ${Date.now()}`,
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
  // EDGE VALIDATION TESTS
  // ========================================

  // Test 8: Edge missing the "id" field
  results.push(await testValidation(
    'Validation: Edge missing id',
    {
      title: `Test edge missing id ${Date.now()}`,
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

  // Test 9: Edge missing the "source" field
  results.push(await testValidation(
    'Validation: Edge missing source',
    {
      title: `Test edge missing source ${Date.now()}`,
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

  // Test 10: Edge missing the "target" field
  results.push(await testValidation(
    'Validation: Edge missing target',
    {
      title: `Test edge missing target ${Date.now()}`,
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

  // Test 11: Edge with non-existent source
  results.push(await testValidation(
    'Validation: Edge source nonexistent',
    {
      title: `Test source nonexistent ${Date.now()}`,
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

  // Test 12: Edge with non-existent target
  results.push(await testValidation(
    'Validation: Edge target nonexistent',
    {
      title: `Test target nonexistent ${Date.now()}`,
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

  // Test 13: Edge with source === target (self-loop)
  results.push(await testValidation(
    'Validation: Edge self-loop',
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

  // Test 14: Edges with duplicate IDs
  results.push(await testValidation(
    'Validation: Edge duplicate IDs',
    {
      title: `Test edge duplicate IDs ${Date.now()}`,
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
  // VALID DIAGRAM TEST
  // ========================================

  // Test 15: Valid complete diagram
  results.push(await testValidation(
    'Validation: Valid diagram',
    {
      title: `Valid diagram ${Date.now()}`,
      description: 'Diagram with correct structure',
      nodes: [
        { id: 'n1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Start' } },
        { id: 'n2', type: 'default', position: { x: 100, y: 100 }, data: { label: 'Process' } },
        { id: 'n3', type: 'output', position: { x: 200, y: 200 }, data: { label: 'End' } }
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
