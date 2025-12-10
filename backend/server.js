const path = require("path");

/**
 * Carga variables de entorno desde archivo .env.
 * Solo se ejecuta en desarrollo local, en Docker se usan variables de environment.
 */
if (process.env.NODE_ENV !== "production") {
  const fs = require("fs");
  const localEnvPath = path.resolve(__dirname, ".env");
  const rootEnvPath = path.resolve(__dirname, "..", ".env");

  if (fs.existsSync(localEnvPath)) {
    require("dotenv").config({ path: localEnvPath });
  } else if (fs.existsSync(rootEnvPath)) {
    require("dotenv").config({ path: rootEnvPath });
  } else {
    require("dotenv").config();
  }
}

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

/**
 * Inicia el servidor Express después de conectar a la base de datos.
 * Ejecuta tests automáticos en modo desarrollo.
 */
async function startServer() {
  await connectDB();

  app.listen(PORT, async () => {
    console.log(`✅ Servidor iniciado en el puerto -> ${PORT}`);

    if (process.env.NODE_ENV !== "production") {
      const testRunner = require("./tests/test-runner");

      try {
        await testRunner.waitForServer();
        await testRunner.runAllTests();
      } catch (error) {
        console.error("⚠️  No se pudieron ejecutar los tests:", error.message);
      }
    }
  });
}

/**
 * Orígenes permitidos para CORS en desarrollo.
 */
const allowedOrigins = [
  `http://localhost:${process.env.FRONTEND_PORT || 5173}`,
  "http://localhost:5173",
  "http://localhost:3000",
];

/**
 * Configuración de CORS para permitir comunicación entre frontend y backend.
 */
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (process.env.NODE_ENV === "production") {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`❌ CORS bloqueado para origen: ${origin}`);
        callback(null, true);
      }
    },
    credentials: true,
  })
);

/**
 * Parseo de JSON y datos de formulario con límite de 10MB para imágenes en base64.
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/**
 * Servir archivos estáticos desde el directorio uploads.
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const routes = require("./routes/index");
app.use("/api", routes);

/**
 * Middleware para capturar y manejar errores de la aplicación.
 * Maneja errores de validación, JWT, claves duplicadas y errores genéricos.
 */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: "Error de validación",
      details: errors,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      error: `El ${field} ya está en uso`,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Token inválido",
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

/**
 * Inicia el servidor.
 */
startServer();
