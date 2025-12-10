const mongoose = require("mongoose");

/**
 * Conecta a la base de datos MongoDB.
 * Lee la URI de conexión desde la variable de entorno MONGO_URI.
 * @async
 * @function connectDB
 * @returns {Promise<void>} Promesa que se resuelve cuando la conexión es exitosa.
 * @throws {Error} Si hay error en la conexión, imprime el error y termina el proceso.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("✅ MongoDB conectado correctamente");
    });
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
