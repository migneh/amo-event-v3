const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { PlayerProfile } = require("../../db/models");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("📊 عرض ملفك الشخصي في الفعاليات")
    .addUserOption(opt =>
      opt.setName("المستخدم")
        .setDescription("عرض ملف لاعب آخر (اختياري)")
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("المستخدم") || interaction.user;
    const profile = await PlayerProfile.findOne({ userId: user.id }) || { points: 0, wins: 0, losses: 0, gamesPlayed: 0 };

    const embed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setTitle(`🎟️ ملف اللاعب: ${user.username}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "🏆 النقاط", value: `${profile.points}`, inline: true },
        { name: "✅ عدد الفوز", value: `${profile.wins}`, inline: true },
        { name: "❌ عدد الخسارة", value: `${profile.losses}`, inline: true },
        { name: "🎮 عدد المشاركات", value: `${profile.gamesPlayed}`, inline: true }
      )
      .setFooter({ text: "من تطوير nept 💎" });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
