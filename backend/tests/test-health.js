// Tests for basic endpoints (health, echo, etc)
const http = require('http');

function testEndpoint(testName, path, method = 'GET', body = null, expectedStatus = 200) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000 // 5 second timeout
    };

    if (body) {
      const data = JSON.stringify(body);
      options.headers['Content-Length'] = data.length;
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        const passed = res.statusCode === expectedStatus;
        resolve({ 
          testName, 
          passed, 
          status: res.statusCode, 
          expectedStatus,
          response: responseData 
        });
      });
    });

    req.on('error', (error) => {
      resolve({ 
        testName, 
        passed: false, 
        status: 'ERROR',
        expectedStatus,
        error: error.message 
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ 
        testName, 
        passed: false, 
        status: 'TIMEOUT',
        expectedStatus 
      });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function runTests() {
  const results = [];
  
  // Test 1: Health endpoint
  results.push(await testEndpoint('Health check', '/api/health', 'GET', null, 200));
  
  // Test 2: Echo endpoint
  results.push(await testEndpoint('Echo endpoint', '/api/eco', 'POST', { test: 'data' }, 200));
  
  // Test 3: Root endpoint
  results.push(await testEndpoint('Root endpoint', '/api/', 'GET', null, 200));
  
  return results;
}

module.exports = { runTests };
