const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { GameSession } = require("../../db/models");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("مضاد-الغش")
    .setDescription("🛡️ فحص ومنع اللاعبين المشبوهين أثناء الفعاليات")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const activeGames = await GameSession.find({ guildId: interaction.guild.id, status: "in-progress" });
    if (!activeGames.length)
      return interaction.reply({ content: "⚠️ لا توجد فعاليات نشطة الآن.", ephemeral: true });

    let detected = [];
    for (const session of activeGames) {
      const duplicates = session.players.filter((p, i, arr) => arr.findIndex(x => x.userId === p.userId) !== i);
      detected.push(...duplicates.map(d => d.userId));
    }

    if (!detected.length)
      return interaction.reply({ content: "✅ لم يتم العثور على حالات غش.", ephemeral: true });

    detected = [...new Set(detected)];
    const mentions = detected.map(id => `<@${id}>`).join(", ");
    interaction.reply({ content: `🚫 تم اكتشاف حسابات مشبوهة: ${mentions}`, ephemeral: false });
  }
};
