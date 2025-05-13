import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("test")
    .setDescription("Retourne les informations d'un joueur")
    .addStringOption((option) =>
        option.setName("joueur")
            .setDescription("Joueur à rechercher")
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) { }
