const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
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

module.exports = router;