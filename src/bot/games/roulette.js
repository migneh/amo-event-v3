const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const { GameSession, PlayerProfile } = require("../../db/models");
const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = {
  name: "roulette",
  displayName: "🎰 روليت",
  minPlayers: 4,
  maxPlayers: 40,

  async start(interaction, config, isTournament = false) {
    const channel = interaction.channel;
    const joinBtn = new ButtonBuilder()
      .setCustomId("join_roulette")
      .setLabel("🎮 دخول اللعبة")
      .setStyle(ButtonStyle.Success);
    const leaveBtn = new ButtonBuilder()
      .setCustomId("leave_roulette")
      .setLabel("🚪 خروج")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(joinBtn, leaveBtn);

    const embed = new EmbedBuilder()
      .setTitle("🎰 لعبة روليت بدأت!")
      .setDescription(`انضم للعبة عبر الزر أدناه!\nالحد الأدنى: **${this.minPlayers}** لاعبين`)
      .setColor("#f1c40f")
      .setFooter({ text: "من تطوير nept 💎" })
      .setTimestamp();

    const message = await channel.send({ embeds: [embed], components: [row] });

    const players = new Set();

    const collector = message.createMessageComponentCollector({ time: 30000 });
    collector.on("collect", async i => {
      if (i.customId === "join_roulette") {
        if (players.size >= this.maxPlayers)
          return i.reply({ content: "🚫 اللعبة ممتلئة!", ephemeral: true });
        players.add(i.user.id);
        await i.reply({ content: "✅ تم انضمامك للعبة روليت!", ephemeral: true });
        await updateEmbed();
      } else if (i.customId === "leave_roulette") {
        if (!players.has(i.user.id))
          return i.reply({ content: "❌ أنت لست داخل اللعبة.", ephemeral: true });
        players.delete(i.user.id);
        await i.reply({ content: "🚪 تم خروجك من اللعبة.", ephemeral: true });
        await updateEmbed();
      }
    });

    const updateEmbed = async () => {
      embed.setDescription(
        `🕹️ انضم للعبة!\n**اللاعبين:** ${players.size}/${this.maxPlayers}\n\n${Array.from(players).map(p => `<@${p}>`).join(", ") || "لا أحد بعد"}`
      );
      await message.edit({ embeds: [embed], components: [row] });
    };

    collector.on("end", async () => {
      if (players.size < this.minPlayers) {
        await channel.send("❌ لم تبدأ اللعبة بسبب قلة اللاعبين!");
        return;
      }
      await startGame(Array.from(players));
    });

    const startGame = async playerList => {
      let alive = [...playerList];
      await channel.send(`🎮 تم بدء اللعبة بعدد ${alive.length} لاعبين!`);

      while (alive.length > 1) {
        const randomPlayer = alive[Math.floor(Math.random() * alive.length)];
        const others = alive.filter(p => p !== randomPlayer);

        const select = new StringSelectMenuBuilder()
          .setCustomId("roulette_select")
          .setPlaceholder("اختر من تريد طرده 🔪")
          .addOptions(
            others.map((p, idx) => ({
              label: `${idx + 1}. ${interaction.guild.members.cache.get(p)?.user.username || "مجهول"}`,
              value: p
            }))
          );

        const selectRow = new ActionRowBuilder().addComponents(select);

        const roundMsg = await channel.send({
          content: `🎯 <@${randomPlayer}> تم اختيارك! لديك 15 ثانية لاختيار من تطرده.`,
          components: [selectRow]
        });

        const choice = await roundMsg.awaitMessageComponent({ time: 15000 }).catch(() => null);

        if (!choice) {
          await channel.send(`⌛ <@${randomPlayer}> لم يختر أحدًا وتم طرده!`);
          alive = alive.filter(p => p !== randomPlayer);
          continue;
        }

        const target = choice.values[0];
        alive = alive.filter(p => p !== target);

        await choice.reply({ content: `💣 <@${target}> تم طرده من اللعبة!`, ephemeral: false });
        await sleep(2000);
      }

      const winner = alive[0];
      await channel.send(`🏆 الفائز في لعبة روليت هو: <@${winner}> 🎉`);

      // حفظ النتيجة في قاعدة البيانات
      const winnerProfile = await PlayerProfile.findOneAndUpdate(
        { userId: winner },
        { $inc: { points: 5, wins: 1, gamesPlayed: 1 } },
        { new: true, upsert: true }
      );

      for (const pl of playerList) {
        if (pl !== winner) {
          await PlayerProfile.findOneAndUpdate(
            { userId: pl },
            { $inc: { losses: 1, gamesPlayed: 1 } },
            { upsert: true }
          );
        }
      }

      if (isTournament) {
        await channel.send(`🏅 تم احتساب نقاط البطولة للفائز! (+5 نقاط)`);
      }

      await GameSession.deleteMany({ gameType: "roulette", guildId: interaction.guild.id });
    };
  }
};
