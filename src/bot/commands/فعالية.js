// src/bot/commands/فعالية.js
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("فعالية")
    .setDescription("🎮 بدء لعبة فعالية")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt =>
      opt.setName("اللعبة")
        .setDescription("اختر اللعبة")
        .setRequired(true)
        .addChoices(
          { name: "🎰 روليت", value: "roulette" },
          { name: "🧠 ريبلكا", value: "replika" },
          { name: "🕵️‍♂️ مافيا", value: "mafia" },
          { name: "🙈 غميضة", value: "hide" },
          { name: "💺 كراسي", value: "chairs" },
          { name: "🪨 حجر ورقة مقص", value: "rps" },
          { name: "❌⭕ XO", value: "xo" },
          { name: "💣 قنبلة", value: "bomb" }
        )
    ),

  async execute(interaction) {
    const gameType = interaction.options.getString("اللعبة");
    const { GuildConfig } = require("../../db/models");
    const config = await GuildConfig.findOne({ guildId: interaction.guild.id });

    if (!config)
      return interaction.reply({ content: "⚠️ استخدم /setup أولاً قبل تشغيل أي فعالية.", ephemeral: true });

    try {
      const gameFile = path.join(__dirname, `../games/${gameType}.js`);
      const game = require(gameFile);
      await game.start(interaction, config);
    } catch (err) {
      console.error(err);
      interaction.reply({ content: "❌ حدث خطأ أثناء محاولة تشغيل اللعبة.", ephemeral: true });
    }
  }
};
