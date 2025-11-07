const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

const routes = require("./routes/index");
app.use("/api", routes);



app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`✅Servidor iniciado en el puerto -> ${PORT}`);
});