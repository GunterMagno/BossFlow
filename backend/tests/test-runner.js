// Test Runner - Runs all tests and displays results
const testHealth = require('./test-health');
const testLogin = require('./test-login');
const testRegister = require('./test-register');
const testProtected = require('./test-protected');
const testDiagrams = require('./test-diagrams');
const testValidation = require('./test-validation');
const testImages = require('./test-images');

async function runAllTests() {
  console.log('\n🧪 Running automated tests...');
  
  const allResults = {
    'Health Endpoints': [],
    'Auth - Register': [],
    'Auth - Login': [],
    'Auth - Logout': [],
    'Profile - Protected Route': [],
    'Diagrams - CRUD': [],
    'Validation - Structure': [],
    'Images - Schema': []
  };
  
  try {
    // Run health tests
    allResults['Health Endpoints'] = await testHealth.runTests();
    
    // Run register tests (first, to create users)
    allResults['Auth - Register'] = await testRegister.runTests();
    
    // Run login tests
    allResults['Auth - Login'] = await testLogin.runTests();
    
    // Run protected routes and logout tests
    const protectedResults = await testProtected.runTests();
    
    // Separate logout and profile results
    allResults['Auth - Logout'] = protectedResults.filter(r => r.testName.includes('Logout'));
    allResults['Profile - Protected Route'] = protectedResults.filter(r => r.testName.includes('Profile'));
    
    // Run diagrams tests
    allResults['Diagrams - CRUD'] = await testDiagrams.runTests();
    
    // Run structure validation tests
    allResults['Validation - Structure'] = await testValidation.runTests();
    
    // Run image schema tests
    allResults['Images - Schema'] = await testImages.runTests();
    
    // Display results
    displayResults(allResults);
    
  } catch (error) {
    console.error('❌ Error running tests:', error.message);
  }
}

function displayResults(allResults) {
  console.log('─'.repeat(50));
  
  for (const [category, results] of Object.entries(allResults)) {
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    const icon = passed === total ? '✅' : '❌';
    
    console.log(`${icon} ${category} (${passed}/${total})`);
    
    // Show failed test details
    if (passed < total) {
      results.forEach(r => {
        if (!r.passed) {
          let errorMsg = `Expected ${r.expectedStatus}, got ${r.status}`;
          if (r.error) {
            errorMsg += ` - ${r.error}`;
          }
          if (r.response) {
            try {
              const parsed = JSON.parse(r.response);
              if (parsed.error) {
                errorMsg += ` (${parsed.error})`;
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
          console.log(`   ❌ ${r.testName} - ${errorMsg}`);
        }
      });
    }
  }
  
  console.log('─'.repeat(50));
  console.log('');
}

// Wait for the server to be ready
function waitForServer(maxAttempts = 10, delay = 500) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    let attempts = 0;
    
    const checkServer = () => {
      attempts++;
      
      const req = http.get('http://localhost:5000/api/health', (res) => {
        resolve();
      });
      
      req.on('error', () => {
        if (attempts >= maxAttempts) {
          reject(new Error('Server not available'));
        } else {
          setTimeout(checkServer, delay);
        }
      });
    };
    
    checkServer();
  });
}

module.exports = { runAllTests, waitForServer };
