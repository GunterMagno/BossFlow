require('dotenv').config(); // Cargar variables de entorno
const express = require("express"); // Importar Express
const cors = require("cors"); // Conectar Frontend y Backend
const connectDB = require("./config/database"); // Importar conexión a BD

const app = express();
const PORT = process.env.BACKEND_PORT;

// Conectar a MongoDB
connectDB();

app.use(cors({
  origin: `http://localhost:${process.env.FRONTEND_PORT}`,
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

app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado en el puerto -> ${PORT}`);
});