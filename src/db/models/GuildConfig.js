const mongoose = require("mongoose");
const { Schema } = mongoose;

const GuildConfigSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  eventChannelId: { type: String, default: null }, // قناة الفعاليات
  eventRoleId: { type: String, default: null }, // رتبة مشرف الفعاليات
  defaultMinPlayers: { type: Number, default: 4 },
  defaultMaxPlayers: { type: Number, default: 40 },
  images: {
    roulette: String,
    replica: String,
    mafia: String,
    hideandseek: String,
    chairs: String,
    rps: String,
    xo: String,
    bomb: String,
  },
  tournamentSettings: {
    enabled: { type: Boolean, default: false },
    minGamesSelected: { type: Number, default: 2 },
    pointsScheme: { // نقاط افتراضية، قابل للتعديل
      first: { type: Number, default: 10 },
      second: { type: Number, default: 7 },
      third: { type: Number, default: 5 },
      participation: { type: Number, default: 1 },
      minPrizePoints: { type: Number, default: 20 } // كما طلبت
    },
  },
  logsChannelId: { type: String, default: null }, // قناة السجلات
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GuildConfig", GuildConfigSchema);
