/**
 * Tests para validar el esquema de imágenes en Diagrams y Nodos
 */

const http = require('http');

// Helper para registrar usuario y obtener token
function registerAndLogin() {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const userData = {
      username: `imageuser${timestamp}`,
      email: `image${timestamp}@example.com`,
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

// Test para crear diagrama con imágenes
function testCreateDiagramWithImages(testName, diagramData, token, expectedStatus) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(diagramData);

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/diagrams',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Authorization': `Bearer ${token}`
      }
    };

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

// Tests
async function runTests() {
    const results = [];

    try {
        const authToken = await registerAndLogin();
        const timestamp = Date.now();

        // Test 1: Crear diagrama con imágenes en el diagrama
        const createWithImages = await testCreateDiagramWithImages(
            'Crear diagrama con imágenes',
            {
                title: `Diagrama con Imágenes ${timestamp}`,
                description: 'Test de imágenes',
                images: [
                    {
                        filename: 'background.png',
                        url: '/uploads/diagrams/bg.png',
                        mimeType: 'image/png',
                        size: 204800
                    },
                    {
                        filename: 'logo.webp',
                        url: '/uploads/diagrams/logo.webp',
                        mimeType: 'image/webp',
                        size: 51200
                    }
                ],
                nodes: [],
                edges: []
            },
            authToken,
            201
        );
        results.push(createWithImages);

        // Verificar que se guardaron las imágenes correctamente
        if (createWithImages.passed && createWithImages.data && createWithImages.data.diagram) {
            const diagram = createWithImages.data.diagram;
            const imagesValid = diagram.images && 
                              diagram.images.length === 2 &&
                              diagram.images[0].filename === 'background.png' &&
                              diagram.images[1].mimeType === 'image/webp';
            
            results.push({
                testName: 'Verificar imágenes del diagrama guardadas',
                passed: imagesValid,
                status: imagesValid ? 200 : 'FAIL',
                expectedStatus: 200,
                response: !imagesValid ? JSON.stringify(diagram.images) : undefined
            });
        } else {
            results.push({
                testName: 'Verificar imágenes del diagrama guardadas',
                passed: false,
                status: 'FAIL',
                expectedStatus: 200,
                error: 'El test de creación falló o no retornó datos'
            });
        }

        // Test 2: Crear diagrama con nodo que tiene imagen
        const createWithNodeImage = await testCreateDiagramWithImages(
            'Crear diagrama con nodo con imagen',
            {
                title: `Diagrama Nodo Imagen ${timestamp}`,
                description: 'Test de imagen en nodo',
                nodes: [
                    {
                        id: 'node-1',
                        type: 'customNode',
                        position: { x: 100, y: 100 },
                        data: { label: 'Nodo con imagen' },
                        image: {
                            filename: 'node-icon.png',
                            url: '/uploads/nodes/icon.png',
                            mimeType: 'image/png',
                            size: 15360
                        }
                    }
                ],
                edges: []
            },
            authToken,
            201
        );
        results.push(createWithNodeImage);

        // Verificar que se guardó la imagen del nodo
        if (createWithNodeImage.passed && createWithNodeImage.data && createWithNodeImage.data.diagram) {
            const diagram = createWithNodeImage.data.diagram;
            const nodeImageValid = diagram.nodes &&
                                 diagram.nodes.length === 1 &&
                                 diagram.nodes[0].image &&
                                 diagram.nodes[0].image.filename === 'node-icon.png' &&
                                 diagram.nodes[0].image.mimeType === 'image/png';
            
            results.push({
                testName: 'Verificar imagen del nodo guardada',
                passed: nodeImageValid,
                status: nodeImageValid ? 200 : 'FAIL',
                expectedStatus: 200,
                response: !nodeImageValid ? JSON.stringify(diagram.nodes[0]) : undefined
            });
        } else {
            results.push({
                testName: 'Verificar imagen del nodo guardada',
                passed: false,
                status: 'FAIL',
                expectedStatus: 200,
                error: 'El test de creación falló o no retornó datos'
            });
        }

        // Test 3: Rechazar mimeType inválido
        const invalidMimeType = await testCreateDiagramWithImages(
            'Rechazar mimeType inválido',
            {
                title: `Diagrama MimeType Inválido ${timestamp}`,
                images: [
                    {
                        filename: 'document.pdf',
                        url: '/uploads/doc.pdf',
                        mimeType: 'application/pdf', // No permitido
                        size: 50000
                    }
                ],
                nodes: [],
                edges: []
            },
            authToken,
            400
        );
        results.push(invalidMimeType);

        // Test 4: Rechazar tamaño excesivo
        const invalidSize = await testCreateDiagramWithImages(
            'Rechazar tamaño excesivo (>5MB)',
            {
                title: `Diagrama Tamaño Excesivo ${timestamp}`,
                images: [
                    {
                        filename: 'large-image.jpg',
                        url: '/uploads/large.jpg',
                        mimeType: 'image/jpeg',
                        size: 6 * 1024 * 1024 // 6MB, excede límite
                    }
                ],
                nodes: [],
                edges: []
            },
            authToken,
            400
        );
        results.push(invalidSize);

        // Test 5: Rechazar más de 10 imágenes
        const tooManyImages = [];
        for (let i = 0; i < 11; i++) {
            tooManyImages.push({
                filename: `image-${i}.jpg`,
                url: `/uploads/image-${i}.jpg`,
                mimeType: 'image/jpeg',
                size: 10240
            });
        }

        const exceedLimit = await testCreateDiagramWithImages(
            'Rechazar más de 10 imágenes',
            {
                title: `Diagrama Muchas Imágenes ${timestamp}`,
                images: tooManyImages,
                nodes: [],
                edges: []
            },
            authToken,
            400
        );
        results.push(exceedLimit);

        // Test 6: Validar todos los tipos MIME permitidos
        const validMimeTypes = await testCreateDiagramWithImages(
            'Aceptar todos los tipos MIME válidos',
            {
                title: `Diagrama MIME Válidos ${timestamp}`,
                images: [
                    {
                        filename: 'img1.jpeg',
                        url: '/uploads/img1.jpeg',
                        mimeType: 'image/jpeg',
                        size: 10000
                    },
                    {
                        filename: 'img2.png',
                        url: '/uploads/img2.png',
                        mimeType: 'image/png',
                        size: 10000
                    },
                    {
                        filename: 'img3.gif',
                        url: '/uploads/img3.gif',
                        mimeType: 'image/gif',
                        size: 10000
                    },
                    {
                        filename: 'img4.webp',
                        url: '/uploads/img4.webp',
                        mimeType: 'image/webp',
                        size: 10000
                    }
                ],
                nodes: [],
                edges: []
            },
            authToken,
            201
        );
        results.push(validMimeTypes);

        // Test 7: Diagrama con nodos e imágenes combinados
        const combinedTest = await testCreateDiagramWithImages(
            'Crear diagrama con imágenes y nodos con imágenes',
            {
                title: `Diagrama Completo ${timestamp}`,
                images: [
                    {
                        filename: 'bg.jpg',
                        url: '/uploads/bg.jpg',
                        mimeType: 'image/jpeg',
                        size: 50000
                    }
                ],
                nodes: [
                    {
                        id: 'n1',
                        type: 'input',
                        position: { x: 0, y: 0 },
                        data: { label: 'Inicio' },
                        image: {
                            filename: 'start.png',
                            url: '/uploads/start.png',
                            mimeType: 'image/png',
                            size: 5000
                        }
                    },
                    {
                        id: 'n2',
                        type: 'output',
                        position: { x: 200, y: 200 },
                        data: { label: 'Fin' }
                        // Este nodo NO tiene imagen (opcional)
                    }
                ],
                edges: [
                    { id: 'e1', source: 'n1', target: 'n2' }
                ]
            },
            authToken,
            201
        );
        results.push(combinedTest);

        // Verificar estructura completa
        if (combinedTest.passed && combinedTest.data && combinedTest.data.diagram) {
            const diagram = combinedTest.data.diagram;
            const completeValid = diagram.images && diagram.images.length === 1 &&
                                diagram.nodes && diagram.nodes.length === 2 &&
                                diagram.nodes[0].image && diagram.nodes[0].image.filename === 'start.png' &&
                                !diagram.nodes[1].image && // El segundo nodo NO tiene imagen
                                diagram.edges && diagram.edges.length === 1;
            
            results.push({
                testName: 'Verificar estructura completa con imágenes',
                passed: completeValid,
                status: completeValid ? 200 : 'FAIL',
                expectedStatus: 200,
                response: !completeValid ? JSON.stringify({
                    imagesCount: diagram.images?.length,
                    nodesCount: diagram.nodes?.length,
                    node0HasImage: !!diagram.nodes?.[0]?.image,
                    node1HasImage: !!diagram.nodes?.[1]?.image,
                    edgesCount: diagram.edges?.length
                }) : undefined
            });
        } else {
            results.push({
                testName: 'Verificar estructura completa con imágenes',
                passed: false,
                status: 'FAIL',
                expectedStatus: 200,
                error: 'El test de creación falló o no retornó datos'
            });
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
