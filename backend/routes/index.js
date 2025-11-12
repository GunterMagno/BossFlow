const express = require("express");
const router = express.Router();

router.get("/", (res) => {
  res.json({ mensaje: "✅API funcionando correctamente" });
});

router.post("/eco", (req, res) => {
  console.log("Recibido: ", req.body);
  res.json(req.body);
});

router.get("/health", (req, res) => {
  console.log("Recibido: ", req.body);
  res.json({
    status: "ok",
    timestamp: Date.now(),
  });
});

router.post("/auth/register", (req, res, next) => {
  const authController = require("../controllers/authController");
  authController.register(req, res, next);
});



module.exports = router;