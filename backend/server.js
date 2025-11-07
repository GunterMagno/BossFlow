const express = require("express");
const app = express();

app.use(express.json());

app.post("/eco", (req, res) => {
    console.log("Recibido: ", req.body);
    res.json(req.body);
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.get("/hola/:nombre", (req, res) => {
  const { nombre } = req.params;
  res.send(`Hola, ${nombre}!`);
});

app.post('/suma', (req, res) => {
  const { a, b } = req.body || {};
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'a y b deben ser números' });
  }
  res.json({ result: a + b });
});

app.listen(8080, () => {
  console.log("Servidor corriendo en http://localhost:8080");
});
