#!/usr/bin/env node
// Script to run all tests
// Usage: node tests/run-all-tests.js

const { spawn } = require('child_process');
const http = require('http');

let serverProcess;

// Function to verify the server is ready
function waitForServer(maxAttempts = 20, delay = 500) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkServer = () => {
      attempts++;
      
      const req = http.get('http://localhost:5000/api/health', (res) => {
        console.log('✅ Server ready\n');
        resolve();
      });
      
      req.on('error', () => {
        if (attempts >= maxAttempts) {
          reject(new Error('Server not available'));
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
    // Start the server
    console.log('🚀 Starting server...\n');
    serverProcess = spawn('node', ['server.js'], {
      cwd: __dirname + '/..',
      env: { ...process.env, NODE_ENV: 'test' },
      stdio: 'pipe'
    });

    // Capture server stderr for critical errors
    serverProcess.stderr.on('data', (data) => {
      console.error(`❌ Server error: ${data}`);
    });

    // Wait for the server to be ready
    await waitForServer();

    // Run the tests
    console.log('🧪 Running tests...\n');
    const testRunner = require('./test-runner');
    await testRunner.runAllTests();

    // Finish
    console.log('\n✅ Tests completed\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    // Always close the server
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

// Handle termination signals
process.on('SIGINT', () => {
  console.log('\n⚠️  Interrupted by user');
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

// Run
runTests();
