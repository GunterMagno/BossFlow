#!/usr/bin/env node
// Script para ejecutar todos los tests
// Uso: node tests/run-all-tests.js

const { spawn } = require('child_process');
const http = require('http');

let serverProcess;

// Función para verificar si el servidor está listo
function waitForServer(maxAttempts = 20, delay = 500) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkServer = () => {
      attempts++;
      
      const req = http.get('http://localhost:5000/api/health', (res) => {
        console.log('✅ Servidor listo\n');
        resolve();
      });
      
      req.on('error', () => {
        if (attempts >= maxAttempts) {
          reject(new Error('Servidor no disponible'));
        } else {
          setTimeout(checkServer, delay);
        }
      });
      
      req.setTimeout(2000, () => {
        req.destroy();
      });
    };
    
    checkServer();
  });
}

async function runTests() {
  try {
    // Iniciar el servidor
    console.log('🚀 Iniciando servidor...\n');
    serverProcess = spawn('node', ['server.js'], {
      cwd: __dirname + '/..',
      env: { ...process.env, NODE_ENV: 'test' },
      stdio: 'pipe'
    });

    // Capturar salida del servidor solo para errores críticos
    serverProcess.stderr.on('data', (data) => {
      console.error(`❌ Error del servidor: ${data}`);
    });

    // Esperar a que el servidor esté listo
    await waitForServer();

    // Ejecutar los tests
    console.log('🧪 Ejecutando tests...\n');
    const testRunner = require('./test-runner');
    await testRunner.runAllTests();

    // Finalizar
    console.log('\n✅ Tests completados\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    // Siempre cerrar el servidor
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

// Manejar señales de terminación
process.on('SIGINT', () => {
  console.log('\n⚠️  Interrumpido por usuario');
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(1);
});

process.on('SIGTERM', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(1);
});

// Ejecutar
runTests();
