const mongoose = require("mongoose");

async function connectDB(uri) {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🟢 Connected to MongoDB");
  } catch (err) {
    console.error("🔴 MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
