require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connect");
const { initBot } = require("./bot/client");

const app = express();

app.get("/", (req, res) => res.send("✅ Event Bot is alive!"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectDB(process.env.MONGO_URI);
  initBot();
});
