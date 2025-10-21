const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();

function initBot() {
  client.once("ready", () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
  });

  // تحميل الأوامر (لاحقًا بنضيفها)
  const commandsPath = path.join(__dirname, "commands");
  if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(path.join(commandsPath, file));
      client.commands.set(command.data.name, command);
    }
  }

  // تعامل مع الأوامر
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: "حدث خطأ أثناء تنفيذ الأمر.", ephemeral: true });
    }
  });

  client.login(process.env.DISCORD_TOKEN);
}

module.exports = { initBot, client };
