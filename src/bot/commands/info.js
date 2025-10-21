const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("ℹ️ معلومات عن البوت"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle("🤖 بوت فعاليات Nept")
      .setDescription("بوت فعاليات عربي شامل فيه نظام بطولات، مكافآت، XP، ونظام مكافحة غش.")
      .addFields(
        { name: "💻 المطور", value: "nept", inline: true },
        { name: "🌐 اللغة", value: "JavaScript (Node.js)", inline: true },
        { name: "🧠 قاعدة البيانات", value: "MongoDB", inline: true },
        { name: "⚙️ الاستضافة", value: "Render + UptimeRobot", inline: true },
        { name: "🏆 الألعاب المتاحة", value: "روليت، ريبلكا، مافيا، غميضة، كراسي، حجر ورقة مقص، XO، قنبلة", inline: false }
      )
      .setFooter({ text: "من تطوير nept 💎" });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
