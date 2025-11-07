const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.get("/hola/:nombre", (req, res) => {
  const { nombre } = req.params;
  res.send(`Hola, ${nombre}!`);
});

app.listen(8080, () => {
  console.log("Servidor corriendo en http://localhost:8080");
});