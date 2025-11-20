const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authController = require("../controllers/authController");
const diagramController = require("../controllers/diagramController");

// Peticiones GET
router.get("/", (req, res) => {
  res.json({ mensaje: "✅API funcionando correctamente" });
});

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: Date.now(),
  });
});

router.get("/perfil", auth, (req, res) => {
  res.json({user: req.user});
});

router.get("/diagrams", auth, (req, res, next) => {
  diagramController.getDiagrams(req, res, next);
});

// Peticiones POST

router.post("/eco", (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    console.log("📨 Echo recibido:", req.body);
  }
  res.json(req.body);
});

router.post("/auth/register", (req, res, next) => {
  authController.register(req, res, next);
});

router.post("/auth/login", (req, res, next) => {
  authController.login(req, res, next);
});

router.post("/auth/logout", auth, (req, res, next) => {
  authController.logout(req, res, next);
});

router.post("/diagrams", auth, (req, res, next) => {
  diagramController.createDiagram(req, res, next);
});

// Peticiones DELETE

router.delete("/diagrams/:id", auth, (req, res, next) => {
  diagramController.deleteDiagram(req, res, next);
});

module.exports = router;