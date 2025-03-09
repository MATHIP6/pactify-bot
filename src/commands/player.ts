import { CommandInteraction, SlashCommandBuilder } from "discord.js";
//import { Player, Faction, Ranking } from 'pactify-api';
import Player from '../handle/player';
import Faction from "../handle/faction";
import { getPlayer } from '../handle/player';
import { header } from '../config';
import { EmbedBuilder } from 'discord.js';
import { formatTime, formatDiscordDate } from '../utils/dateFormat';

export const data = new SlashCommandBuilder()
  .setName("player")
  .setDescription("Retourne les informations d'un joueur")
  .addStringOption((option) =>
    option.setName("joueur")
      .setDescription("Joueur à rechercher")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  console.log('token: ', header);
  try {
    await interaction.deferReply();
    const playerName = interaction.options.getString("joueur");
    const player: Player = await getPlayer(playerName, header);
    if (!player) {
      return interaction.reply("Ce joueur est introuvable !");
    }
    const faction: Faction = player.faction;
    console.log(player);
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(player.name)
      .setURL(`https://pactify.fr/player/${player.id}`)
      .setThumbnail(player.headUrl)

    if (player.online) {
      embed.setDescription(`Ce joueur est connecté au monde ${player.onlineServer} !`)
    }

    embed.addFields(
      { name: 'Power: ', value: player.power.toString(), inline: true },
      { name: 'Heures de jeu: ', value: formatTime(player.activityTime), inline: true },
      { name: 'Inscription: ', value: formatDiscordDate(player.registrationDate.toString()), inline: false },
    );

    if (!player.online) {
      embed.addFields(
        { name: 'Dernière connection le', value: formatDiscordDate(player.lastActivityDate.toString()) }
      )
    }
    if (faction) {
      if (!faction.icon) {
        faction.icon = "🏳";
      }
      const factionLink = `**[${faction.icon + faction.name}](https://pactify.com/faction/${faction.id})**`;
      embed.addFields(
        { name: 'Faction: ', value: factionLink, inline: true },
        { name: 'Role: ', value: player.role.toString(), inline: true },
      );
    } else {
      embed.addFields(
        { name: "Faction: ", value: "Ce joueur n'a pas de Faction.", inline: true },
      )
    }
    return interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Erreur !!!", error);
  }
}
