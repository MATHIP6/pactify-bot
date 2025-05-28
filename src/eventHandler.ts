import { EmbedBuilder } from "discord.js";
import { client } from ".";
import { header } from "./config";
import Event from "./database/event.model";
import { getLastEvent } from "./api/fetch";
import { formatDate } from "./utils/dateFormat";

let lastEventTime: Date;

export async function fetchLastEvent() {
  const event = await getLastEvent(header);
  if (
    !event ||
    !event.id ||
    !event.name ||
    !event.startDate ||
    !event.endDate ||
    !event.points
  ) {
    return;
  }
  if (!lastEventTime) {
    lastEventTime = event.endDate;
    return;
  }
  if (event.endDate <= lastEventTime) {
    return;
  }
  lastEventTime = event.endDate;
  const servers = await Event.findAll();
  for (const server of servers) {
    const guild = client.guilds.cache.get(server.guild);
    if (!guild) {
      await server.destroy();
      continue;
    }
    const channel = guild.channels.cache.get(server.channel);
    if (!channel) {
      await server.destroy();
      continue;
    }
    const faction = event.points[0].faction;
    const time = formatDate(
      event.endDate.getTime() - event.startDate.getTime(),
    );
    const embed = new EmbedBuilder()
      .setTitle("Résumé de l'event")
      .setURL(`https://pactify.fr/event/${event.id}`)
      .addFields(
        { name: "Event", value: event.name, inline: true },
        { name: "Temps", value: `${time}`, inline: true },
        {
          name: "Gagnant",
          value: `[${faction.icon + faction.name}](https://pactify.fr/faction/${faction.id}) +(${event.points[0].points} points)`,
        },
      );
    if (server.mustMention) {
      if (server.role && guild.roles.cache.has(server.role)) {
        await channel.send({
          content: `<@&${server.role}>`,
          embeds: [embed],
        });
        continue;
      }
      server.mustMention = false;
      await server.save();
    }
    await channel.send({ embeds: [embed] });
  }
}
