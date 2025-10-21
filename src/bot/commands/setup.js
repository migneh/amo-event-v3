const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { GuildConfig } = require("../../db/models");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("⚙️ إعداد بوت الفعاليات")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(opt =>
      opt.setName("قناة_الفعاليات")
        .setDescription("القناة التي ستتم فيها الفعاليات")
        .setRequired(true)
    )
    .addRoleOption(opt =>
      opt.setName("رتبة_المشرف")
        .setDescription("الرتبة المسموح لها تشغيل الفعاليات")
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel("قناة_الفعاليات");
    const role = interaction.options.getRole("رتبة_المشرف");

    await GuildConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { eventChannelId: channel.id, eventRoleId: role.id },
      { upsert: true }
    );

    await interaction.reply({
      content: `✅ تم إعداد البوت بنجاح!\n📢 القناة: ${channel}\n🧑‍💼 رتبة المشرف: ${role}`,
      ephemeral: true
    });
  }
};
