const path = require("path");

/**
 * Load environment variables from an .env file.
 * Only runs in local development; Docker uses environment variables.
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
    console.log(`✅ Server started on port -> ${PORT}`);

    if (process.env.NODE_ENV !== "production") {
      const testRunner = require("./tests/test-runner");

      try {
        await testRunner.waitForServer();
        await testRunner.runAllTests();
        } catch (error) {
        console.error("⚠️  Could not run tests:", error.message);
      }
    }
  });
}

/**
 * Allowed origins for CORS in development.
 */
const allowedOrigins = [
  `http://localhost:${process.env.FRONTEND_PORT || 5173}`,
  "http://localhost:5173",
  "http://localhost:3000",
];

/**
 * CORS configuration to allow communication between frontend and backend.
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
        console.log(`❌ CORS blocked for origin: ${origin}`);
        callback(null, true);
      }
    },
    credentials: true,
  })
);

/**
 * Parse JSON and form data with a 10MB limit for base64 images.
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/**
 * Serve static files from the uploads directory.
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const routes = require("./routes/index");
app.use("/api", routes);

/**
 * Error-handling middleware for the application.
 * Handles validation errors, JWT errors, duplicate keys and generic errors.
 */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

    if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: "Validation error",
      details: errors,
    });
  }

    if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      error: `The ${field} is already in use`,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid token",
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
