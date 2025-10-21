const mongoose = require("mongoose");
const { Schema } = mongoose;

const LogSchema = new Schema({
  guildId: String,
  type: { type: String, required: true }, // 'join','leave','kick','game_start','game_end','cheat','tournament'
  actorId: String, // من نفذ الفعل (مستخدم/بوت)
  targetId: String, // المتأثر (مستخدم)
  message: String,
  meta: { type: Schema.Types.Mixed, default: {} }, // أي بيانات إضافية (sessionId, tournamentId...)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", LogSchema);
