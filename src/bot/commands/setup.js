const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { GuildConfig } = require("../../db/models");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("🔧 إعداد بوت الفعاليات للسيرفر (للمشرفين فقط)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(opt =>
      opt.setName("event_channel")
        .setDescription("📢 اختر قناة الفعاليات")
        .setRequired(true))
    .addRoleOption(opt =>
      opt.setName("event_role")
        .setDescription("🎭 اختر رتبة مشرف الفعاليات")
        .setRequired(true))
    .addChannelOption(opt =>
      opt.setName("logs_channel")
        .setDescription("📜 قناة السجلات (اختياري)")
        .setRequired(false))
    .addBooleanOption(opt =>
      opt.setName("tournaments_enabled")
        .setDescription("🎯 تفعيل نظام البطولات؟")
        .setRequired(false))
    .addIntegerOption(opt =>
      opt.setName("min_prize_points")
        .setDescription("🏆 الحد الأدنى لنقاط الجائزة (افتراضي 20)")
        .setRequired(false)),

  async execute(interaction) {
    const guildId = interaction.guild.id;

    const eventChannel = interaction.options.getChannel("event_channel");
    const eventRole = interaction.options.getRole("event_role");
    const logsChannel = interaction.options.getChannel("logs_channel");
    const tournamentsEnabled = interaction.options.getBoolean("tournaments_enabled") ?? false;
    const minPrizePoints = interaction.options.getInteger("min_prize_points") ?? 20;

    await interaction.deferReply({ ephemeral: true });

    try {
      let config = await GuildConfig.findOne({ guildId });

      if (!config) config = new GuildConfig({ guildId });

      config.eventChannelId = eventChannel.id;
      config.eventRoleId = eventRole.id;
      config.logsChannelId = logsChannel?.id || null;
      config.tournamentSettings.enabled = tournamentsEnabled;
      config.tournamentSettings.pointsScheme.minPrizePoints = minPrizePoints;

      await config.save();

      return interaction.editReply({
        content: [
          `✅ **تم إعداد البوت بنجاح في هذا السيرفر!**`,
          `\n**قناة الفعاليات:** <#${eventChannel.id}>`,
          `**رتبة مشرف الفعاليات:** <@&${eventRole.id}>`,
          logsChannel ? `**قناة السجلات:** <#${logsChannel.id}>` : "",
          `**نظام البطولات:** ${tournamentsEnabled ? "مفعل ✅" : "معطل ❌"}`,
          `**الحد الأدنى لنقاط الجائزة:** ${minPrizePoints}`
        ].join("\n")
      });

    } catch (err) {
      console.error(err);
      return interaction.editReply({
        content: "❌ حدث خطأ أثناء إعداد البوت. حاول لاحقًا أو تواصل مع الدعم."
      });
    }
  }
};
