import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getPlayer } from "../api/player";
import { header } from "../config";
import { EmbedBuilder } from "discord.js";
import { formatTime, formatDiscordDate } from "../utils/dateFormat";

export const data = new SlashCommandBuilder()
  .setName("player")
  .setDescription("Retourne les informations d'un joueur")
  .addStringOption((option) =>
    option
      .setName("joueur")
      .setDescription("Joueur à rechercher")
      .setRequired(true),
  );

export async function execute(interaction: CommandInteraction) {
  try {
    await interaction.deferReply();
    const playerName: string = interaction.options.getString("joueur");
    if (playerName.length > 18) {
      return await interaction.editReply("La taille du pseudo est trop long !");
    }
    const player = await getPlayer(playerName, header);
    if (!player) {
      return interaction.editReply("Ce joueur est introuvable !");
    }
    const faction = player.faction;
    if (
      player.online == undefined ||
      !player.name ||
      !player.headUrl ||
      !player.power ||
      !player.registrationDate ||
      !player.lastActivityDate ||
      !player.activityTime) {
      return interaction.editReply(
        "Ce joueur n'a pas de données disponibles pour le moment. ",
      );
    }
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(player.name)
      .setURL(`https://pactify.fr/player/${player.id}`)
      .setThumbnail(player.headUrl);

    if (player.online) {
      embed.setDescription(
        `Ce joueur est connecté au monde ${player.onlineServer} !`,
      );
    }

    embed.addFields(
      { name: "Power: ", value: player.power.toString(), inline: true },
      {
        name: "Heures de jeu: ",
        value: formatTime(player.activityTime),
        inline: true,
      },
      {
        name: "Inscription: ",
        value: formatDiscordDate(player.registrationDate.toString()),
        inline: false,
      },
    );

    if (!player.online) {
      embed.addFields({
        name: "Dernière connection le",
        value: formatDiscordDate(player.lastActivityDate.toString()),
      });
    }
    if (faction) {
      if (!faction.icon || !player.role) {
        return interaction.editReply(
          "Ce joueur n'a pas de données de faction disponibles pour le moment.",
        );
      }
      const factionLink = `**[${faction.icon + faction.name}](https://pactify.com/faction/${faction.id})**`;
      embed.addFields(
        { name: "Faction: ", value: factionLink, inline: true },
        { name: "Role: ", value: player.role.toString(), inline: true },
      );
    } else {
      embed.addFields({
        name: "Faction: ",
        value: "Ce joueur n'a pas de Faction.",
        inline: true,
      });
    }
    return interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Erreur !!!", error);
  }
}
