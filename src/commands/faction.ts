import { CommandInteraction, SlashCommandBuilder } from "discord.js";
//import { Player, Faction, Ranking } from 'pactify-api';
import Player from '../handle/player';
import Faction from "../handle/faction";
import { getFaction } from '../handle/faction';
import { header } from '../config';
import { EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName("faction")
  .setDescription("Retourne les informations d'une Faction")
  .addStringOption((option) =>
    option.setName("faction")
      .setDescription("Faction à rechercher")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  console.log('token: ', header);
  try {
    const factionName = interaction.options.getString("faction");
    const faction: Faction = await getFaction(factionName, header);
    if (!faction) {
      return interaction.reply("Cette Faction est introuvable !");
    }
    if (!faction.name || !faction.creationDate || !faction.statesHistory) {
      console.log(faction.name, faction.creationDate, faction.description)
      throw new Error("Faction attributes is undefined !!!");
    }
    let claims;
    let power;
    let AP;
    const lastState = faction.statesHistory[0];
    power = lastState.power;
    claims = lastState.claimsCount;
    AP = lastState.claimsApCount;
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(faction.icon + faction.name)
      .setURL('https://pactify.fr')
      .addFields(
        { name: 'Date de creation', value: formatDiscordDate(faction.creationDate.toString()), inline: false },
      );
    if (faction.description) {
      embed.setDescription(faction.description)
    }
    if (lastState) {
      embed.addFields(
        { name: 'Power', value: power.toString(), inline: true },
        { name: 'Claims', value: claims.toString(), inline: true },
      )
      if (AP > 0) {
        embed.addFields({ name: 'AP', value: AP.toString(), inline: true });
      }
      let players = '';
      for (let player of lastState.members) {
        player.name = faction.membersRef[player.id].name;
        players += `**[${player.name}](http://pactify.fr/player/${player.id})** `
      }
      embed.addFields({ name: `Joueurs(${lastState.members.length})`, value: players, inline: false });

      if (lastState.allies.length > 0) {
        let allies = '';
        for (let allyFaction of lastState.allies) {
          allies += `**[${allyFaction.icon + allyFaction.name}](https://pactify.fr/faction/${allyFaction.id})** `
        }
        embed.addFields({ name: `Alliés(${lastState.allies.length})`, value: allies, inline: false });
      }
    }
    /*let players = '';

    for (let playerID in faction.membersRef) {
      const player = faction.membersRef[playerID]
      players += `**[${player.name}](http://pactify.fr)** `
    }*/
    return interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error("Erreur !!!", error);
  }
}

function formatDate(stringDate: Date) {
  const date = new Date(stringDate.toString());
  let formetDdate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  let time = `${String(date.getHours()).padStart(2, '0')} heure(s) ${String(date.getMinutes()).padStart(2, '0')} minute(s) et ${String(date.getSeconds()).padStart(2, '0')} seconde(s)`;
  return `${formetDdate} à ${time}`
}

function formatDiscordDate(dateString: string) {
  const date = new Date(dateString);
  const formattedDate = Math.floor(date.getTime() / 1000); // Convertir en secondes
  return `<t:${formattedDate}:d>`;
}

// Exemple d'utilisation
const discordDate = formatDiscordDate('2020-06-12T14:41:01.000Z');
console.log(discordDate);

function formatTime(time: number) {
  const seconds = time % 60;
  const minutes = Math.floor((time / 60) % 60);
  const hours = Math.floor(time / 3600);

  let result = '';

  if (hours > 0) {
    result += `${hours} heure(s)`;
  }
  if (minutes > 0) {
    if (result) result += ', ';
    result += `${minutes} minute(s)`;
  }
  if (seconds > 0) {
    if (result) result += ' et ';
    result += `${seconds} seconde(s)`;
  }

  return result || '0 seconde(s)';
}
