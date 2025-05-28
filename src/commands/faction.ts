import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getFaction } from "../api/faction";
import { header } from "../config";
import { EmbedBuilder } from "discord.js";
import { formatDiscordDate } from "../utils/dateFormat";

export const data = new SlashCommandBuilder()
  .setName("faction")
  .setDescription("Retourne les informations d'une Faction")
  .addStringOption((option) =>
    option
      .setName("faction")
      .setDescription("Faction à rechercher")
      .setRequired(true),
  );

export async function execute(interaction: CommandInteraction) {
  try {
    await interaction.deferReply();
    const factionName = interaction.options.getString("faction");
    if (factionName.length > 7) {
      return await interaction.editReply(
        "La taille de la faction est trop longue !",
      );
    }
    const faction = await getFaction(factionName, header);
    if (!faction) {
      return interaction.editReply("Cette Faction est introuvable !");
    }

    if (!faction.name || !faction.creationDate || !faction.statesHistory) {
      console.log(faction.name, faction.creationDate, faction.description);
      throw new Error("Faction attributes is undefined !!!");
    }
    const lastState = faction.statesHistory[0];
    const claims = lastState.claimsCount;
    const power = lastState.power;
    const AP = lastState.claimsApCount;
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(faction.icon + faction.name)
      .setURL("https://pactify.fr")
      .addFields({
        name: "Date de creation",
        value: formatDiscordDate(faction.creationDate.toString()),
        inline: false,
      });
    if (faction.description) {
      embed.setDescription(faction.description);
    }
    if (lastState) {
      embed.addFields(
        { name: "Power", value: power.toString(), inline: true },
        { name: "Claims", value: claims.toString(), inline: true },
      );
      if (AP > 0) {
        embed.addFields({ name: "AP", value: AP.toString(), inline: true });
      }
      let players = "";
      for (const player of lastState.members) {
        if (faction.membersRef && faction.membersRef[player.id]) {
          player.name = faction.membersRef[player.id].name;
          players += `**[${player.name}](http://pactify.fr/player/${player.id})** `;
        } else {
          console.warn(
            `Player ID ${player.id} not found in faction.membersRef`,
          );
        }
      }
      embed.addFields({
        name: `Joueurs(${lastState.members.length})`,
        value: players,
        inline: false,
      });

      if (lastState.allies.length > 0) {
        let allies = "";
        for (const allyFaction of lastState.allies) {
          allies += `**[${allyFaction.icon + allyFaction.name}](https://pactify.fr/faction/${allyFaction.id})** `;
        }
        embed.addFields({
          name: `Alliés(${lastState.allies.length})`,
          value: allies,
          inline: false,
        });
      }
    }
    return interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Erreur !!!", error);
  }
}
