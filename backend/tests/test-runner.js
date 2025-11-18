// Test Runner - Ejecuta todos los tests y muestra resultados
const testHealth = require('./test-health');
const testLogin = require('./test-login');
const testRegister = require('./test-register');
const testProtected = require('./test-protected');

async function runAllTests() {
  console.log('\n🧪 Ejecutando tests automáticos...\n');
  
  const allResults = {
    'Health Endpoints': [],
    'Auth - Register': [],
    'Auth - Login': [],
    'Auth - Logout': [],
    'Perfil - Ruta Protegida': []
  };
  
  try {
    // Ejecutar tests de health
    allResults['Health Endpoints'] = await testHealth.runTests();
    
    // Ejecutar tests de register (primero para crear usuarios)
    allResults['Auth - Register'] = await testRegister.runTests();
    
    // Ejecutar tests de login
    allResults['Auth - Login'] = await testLogin.runTests();
    
    // Ejecutar tests de rutas protegidas y logout
    const protectedResults = await testProtected.runTests();
    
    // Separar resultados de logout y perfil
    allResults['Auth - Logout'] = protectedResults.filter(r => r.testName.includes('Logout'));
    allResults['Perfil - Ruta Protegida'] = protectedResults.filter(r => r.testName.includes('Perfil'));
    
    // Mostrar resultados
    displayResults(allResults);
    
  } catch (error) {
    console.error('❌ Error ejecutando tests:', error.message);
  }
}

function displayResults(allResults) {
  console.log('─'.repeat(50));
  
  for (const [category, results] of Object.entries(allResults)) {
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    const icon = passed === total ? '✅' : '❌';
    
    console.log(`${icon} ${category} (${passed}/${total})`);
    
    // Mostrar detalles de tests fallidos
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
              // Ignorar errores de parsing
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

// Esperar a que el servidor esté listo
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
          reject(new Error('Servidor no disponible'));
        } else {
          setTimeout(checkServer, delay);
        }
      });
    };
    
    checkServer();
  });
}

module.exports = { runAllTests, waitForServer };
