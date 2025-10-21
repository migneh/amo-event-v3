const mongoose = require("mongoose");
const { Schema } = mongoose;

const TournamentSchema = new Schema({
  guildId: { type: String, required: true, index: true },
  createdBy: String,
  name: { type: String, required: true },
  games: [
    {
      gameType: String,
      rounds: { type: Number, default: 1 },
      settings: { type: Schema.Types.Mixed, default: {} } // إعدادات محددة للعبة داخل البطولة
    }
  ],
  currentGameIndex: { type: Number, default: 0 },
  currentRound: { type: Number, default: 0 },
  players: [
    {
      userId: String,
      points: { type: Number, default: 0 },
      stats: { type: Schema.Types.Mixed, default: {} } // wins/losses per game
    }
  ],
  status: { type: String, enum: ['created','running','paused','finished'], default: 'created' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TournamentSchema.pre('save', function(next){ this.updatedAt = Date.now(); next(); });

module.exports = mongoose.model("Tournament", TournamentSchema);
