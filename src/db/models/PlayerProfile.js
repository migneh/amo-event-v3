const mongoose = require("mongoose");
const { Schema } = mongoose;

const PlayerProfileSchema = new Schema({
  userId: { type: String, required: true }, // ID المستخدم
  guildId: { type: String, required: true, index: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  gamesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  topGames: { type: Map, of: Number, default: {} }, // { roulette: 5, mafia: 2 }
  penalties: [
    {
      reason: String,
      date: { type: Date, default: Date.now },
      until: Date, // لو فيه مدة للعقوبة
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

PlayerProfileSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model("PlayerProfile", PlayerProfileSchema);
