const mongoose = require("mongoose");
const config = require("../config");

// Replace with your MongoDB connection string
const DB_URI =
  `${config.mongoDb.url}${config.mongoDb.dbName}` ||
  `mongodb://localhost:27017/`;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
