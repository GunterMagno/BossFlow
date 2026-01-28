const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database.
 * Reads the connection URI from the MONGO_URI environment variable.
 * @async
 * @function connectDB
 * @returns {Promise<void>} Promise that resolves when the connection is successful.
 * @throws {Error} If there is a connection error, logs the error and exits the process.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("✅ MongoDB connected successfully");
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
