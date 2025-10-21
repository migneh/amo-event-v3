const mongoose = require("mongoose");
const { Schema } = mongoose;

const PlayerSubSchema = new Schema({
  userId: String,
  joinedAt: { type: Date, default: Date.now },
  alive: { type: Boolean, default: true },
  role: { type: String, default: null }, // للمافيا أو أدوار أخرى
  meta: { type: Schema.Types.Mixed, default: {} } // حفظ حقول مؤقتة خاصة باللعبة
});

const GameSessionSchema = new Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  createdBy: { type: String }, // id المشغل
  gameType: { type: String, required: true }, // 'roulette','replica',...
  players: [PlayerSubSchema],
  settings: { type: Schema.Types.Mixed, default: {} }, // إعدادات لكل لعبة (minPlayers, maxPlayers, timers...)
  imageUrl: { type: String, default: null },
  status: { type: String, enum: ['registering','running','paused','finished'], default: 'registering' },
  registrationMessageId: { type: String, default: null }, // id رسالة التسجيل embed
  currentRound: { type: Number, default: 0 },
  results: { type: Schema.Types.Mixed, default: {} }, // تخزين نتائج مؤقتة
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

GameSessionSchema.pre('save', function(next){ this.updatedAt = Date.now(); next(); });

module.exports = mongoose.model("GameSession", GameSessionSchema);
