import { CommandInteraction, SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
  .setName("invite")
  .setDescription("Invite le bot sur ton serveur Discord");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply(
    "Invite le bot avec ce lien: https://discord.com/oauth2/authorize?client_id=1347614449644601485&permissions=517544073280&integration_type=0&scope=bot",
  );
}
