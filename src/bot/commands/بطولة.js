const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("بطولة")
    .setDescription("🏆 بدء بطولة فعاليات مكونة من عدة ألعاب")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt =>
      opt.setName("الألعاب")
        .setDescription("حدد الألعاب (افصل بينها بفواصل: roulette, xo, rps ...)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { GuildConfig } = require("../../db/models");
    const config = await GuildConfig.findOne({ guildId: interaction.guild.id });

    if (!config)
      return interaction.reply({ content: "⚠️ استخدم /setup أولاً قبل تشغيل البطولة.", ephemeral: true });

    const games = interaction.options.getString("الألعاب").split(",").map(g => g.trim());
    await interaction.reply({ content: `🏁 بدء بطولة تتضمن ${games.length} ألعاب...`, ephemeral: true });

    for (const gameType of games) {
      try {
        const gameFile = path.join(__dirname, `../games/${gameType}.js`);
        const game = require(gameFile);
        await game.start(interaction, config, true); // تمرير فلاغ "true" يعني داخل بطولة
      } catch (err) {
        console.error(`[❌] فشل في تشغيل ${gameType}:`, err);
      }
    }

    interaction.followUp({ content: "🎉 البطولة انتهت! تم حساب النقاط النهائية 🏆" });
  }
};
