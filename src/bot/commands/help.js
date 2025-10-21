const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("📖 عرض أوامر بوت الفعاليات"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setTitle("🎮 أوامر بوت الفعاليات")
      .setDescription("جميع الأوامر الأساسية لإدارة وتشغيل فعاليات السيرفر")
      .addFields(
        { name: "⚙️ /setup", value: "إعداد البوت وتحديد قناة الفعاليات والرتب", inline: false },
        { name: "🎯 /فعالية", value: "بدء لعبة من ألعاب الفعاليات", inline: false },
        { name: "🏆 /بطولة", value: "بدء بطولة تشمل عدة ألعاب", inline: false },
        { name: "🧩 /profile", value: "عرض ملف لاعب (إحصائياته ونقاطه)", inline: false },
        { name: "🚫 /مضاد-الغش", value: "استخدام نظام مكافحة الغش وطرد اللاعبين المخالفين", inline: false },
        { name: "ℹ️ /info", value: "معلومات حول البوت والمطور", inline: false }
      )
      .setFooter({ text: "من تطوير: nept 💎", iconURL: interaction.client.user.displayAvatarURL() });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("➕ أضف البوت إلى سيرفرك")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands`)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
