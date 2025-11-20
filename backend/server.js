const path = require('path');
// Solo cargar .env en desarrollo local, en Docker usamos variables de environment
if (process.env.NODE_ENV !== 'production') {
  // Intentar cargar .env desde el directorio backend primero, luego desde la raíz
  const fs = require('fs');
  const localEnvPath = path.resolve(__dirname, '.env');
  const rootEnvPath = path.resolve(__dirname, '..', '.env');
  
  if (fs.existsSync(localEnvPath)) {
    require('dotenv').config({ path: localEnvPath });
  } else if (fs.existsSync(rootEnvPath)) {
    require('dotenv').config({ path: rootEnvPath });
  } else {
    require('dotenv').config(); // Intentar cargar desde el directorio actual
  }
}
const express = require("express"); // Importar Express
const cors = require("cors"); // Conectar Frontend y Backend
const connectDB = require("./config/database"); // Importar conexión a BD

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Función para iniciar servidor
async function startServer() {
  // Primero conectar a MongoDB
  await connectDB();
  
  // Luego iniciar el servidor HTTP
  app.listen(PORT, async () => {
    console.log(`✅ Servidor iniciado en el puerto -> ${PORT}`);
    
    // Ejecutar tests automáticos si está en modo desarrollo
    if (process.env.NODE_ENV !== 'production') {
      const testRunner = require('./tests/test-runner');
      
      try {
        // Esperar un momento para que el servidor esté completamente listo
        await testRunner.waitForServer();
        await testRunner.runAllTests();
      } catch (error) {
        console.error('⚠️  No se pudieron ejecutar los tests:', error.message);
      }
    }
  });
}

// Configurar CORS para permitir tanto desarrollo local como Docker
const allowedOrigins = [
  `http://localhost:${process.env.FRONTEND_PORT || 5173}`,
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    // En producción, permitir todos los orígenes (ya que Nginx hace el proxy)
    if (process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ CORS bloqueado para origen: ${origin}`);
      callback(null, true); // En desarrollo, permitimos todos los orígenes
    }
  },
  credentials: true
}));

app.use(express.json());

const routes = require("./routes/index");
app.use("/api", routes);

// Middleware para capturar y manejar errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ 
      error: 'Error de validación', 
      details: errors 
    });
  }

  // Error de clave duplicada (email o username ya existe)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ 
      error: `El ${field} ya está en uso` 
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: 'Token inválido' 
    });
  }

  // Error genérico
  res.status(500).json({ 
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar el servidor
startServer();