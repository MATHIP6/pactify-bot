import { Client, EmbedBuilder } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { components } from "./components";
import { initDatabase, sequelize } from "./database/databaseHandler";
import { fetchLastEvent } from "./eventHandler";

export const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once("ready", async () => {
    initDatabase();
    client.guilds.cache.forEach(async (guild) => {
        await deployCommands({ guildId: guild.id });
    });
    console.log("Discord bot is ready with username:", client.user?.username);
    setInterval(async () => {
        await fetchLastEvent()
    }, 1000 * 60);
});

client.on("guildCreate", async (guild) => {
    console.log("guild: ", guild);
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        if (interaction.isMessageComponent()) {
            components.forEach(component => {
                if (component.id === interaction.customId) {
                    component.handle(interaction);
                }
            })
        }
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.login(config.DISCORD_TOKEN);

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());

const shutdown = () => {
    sequelize.close();
    console.log('Bye bye 👋');
    process.exit(0);
}

