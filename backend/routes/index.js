const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ mensaje: "✅API funcionando correctamente" });
});

router.post("/eco", (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    console.log("📨 Echo recibido:", req.body);
  }
  res.json(req.body);
});

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: Date.now(),
  });
});

router.post("/auth/register", (req, res, next) => {
  const authController = require("../controllers/authController");
  authController.register(req, res, next);
});

router.post("/auth/login", (req, res, next) => {
  const authController = require("../controllers/authController");
  authController.login(req, res, next);
});

module.exports = router;