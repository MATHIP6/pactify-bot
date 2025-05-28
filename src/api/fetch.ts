import Player from "./player";
import Faction from "./faction";
import Event from "./event";
import { EventPoint } from "./event";

const endpoint = "https://www.pactify.fr/api";

export async function searchPlayer(username: string, previousHeaders) {
  const headers = previousHeaders;

  try {
    const response = await fetch(
      `${endpoint}/player/search?name=${encodeURIComponent(username.toLowerCase())}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + headers.token,
          Cookie: headers.cookies,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if ("current" in result) {
      return result;
    } else {
      return undefined;
    }
  } catch (e) {
    throw e;
  }
}

export async function playerInfos(id: string, previousHeaders: any) {
  const headers = previousHeaders;

  try {
    const response = await fetch(
      `${endpoint}/player/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + headers.token,
          Cookie: headers.cookies,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const player = new Player(id);
    player.name = result.name;
    player.power = result.power;
    player.onlineServer = result.onlineServer;
    player.role = result.role;
    player.rank = result.rank;
    player.headUrl = result.headUrl;
    player.online = result.online;

    player.registrationDate = new Date(Date.parse(result.registrationDate));
    player.lastActivityDate = new Date(Date.parse(result.lastActivityDate));
    player.factionLastActivityDate = new Date(Date.parse(result.factionLastActivityDate));
    if ("faction" in result) {
      const faction: Faction = new Faction(result.faction.id);
      faction.name = result.faction.name;
      if (result.icon) {
        faction.icon = result.faction.icon;
      } else {
        faction.icon = "🏳";
      }
      faction.creationDate = new Date(Date.parse(result.faction.creationDate));
      faction.firstDay = new Date(Date.parse(result.faction.firstDay));
      faction.lastDay = new Date(Date.parse(result.faction.lastDay));
      player.faction = faction;
    }

    return player;
  } catch (error) {
    throw error;
  }
}

export async function searchFaction(name: string, previousHeaders) {
  const headers = previousHeaders;

  try {
    const response = await fetch(
      `${endpoint}/faction/search?name=${encodeURIComponent(name.toLowerCase())}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + headers.token,
          Cookie: headers.cookies,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if ("current" in result) {
      for (const hist of result.history) {
        hist.from = new Date(Date.parse(hist.from));
      }
      return result;
    } else {
      return undefined;
    }
  } catch (e) {
    throw e;
  }
}

export async function factionInfos(id, previousHeaders) {
  const headers = previousHeaders;

  try {
    const response = await fetch(
      `${endpoint}/faction/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + headers.token,
          Cookie: headers.cookies,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const faction = new Faction(id);
    if ("creationDate" in result) {
      faction.creationDate = new Date(Date.parse(result.creationDate));
    }
    if ("firstDay" in result) {
      faction.firstDay = new Date(Date.parse(result.firstDay));
    }
    if ("lastDay" in result) {
      faction.lastDay = new Date(Date.parse(result.lastDay));
    }
    if ("statesHistory" in result) {
      faction.statesHistory = [];
      for (const state of result.statesHistory) {
        state.day = new Date(Date.parse(state.day));
        faction.statesHistory.push(state);
      }
    }
    faction.name = result.name;
    faction.description = result.description;
    if (result.icon) {
      faction.icon = result.icon;
    }

    if ("membersRef" in result) {
      faction.membersRef = {};
      for (const ref of Object.keys(result.membersRef)) {
        const playerData = result.membersRef[ref];
        const player = new Player(playerData.id);
        player.name = playerData.name;
        player.power = playerData.power;
        player.role = playerData.role;
        player.lastActivityDate = new Date(Date.parse(playerData.lastActivityDate));
        player.factionLastActivityDate = new Date(Date.parse(playerData.factionLastActivityDate));
        faction.membersRef[ref] = player;
      }
    }

    return faction;
  } catch (error) {
    throw error;
  }
}

export async function getLastEvent(previousHeaders: any) {
  const headers = previousHeaders;

  try {
    const response = await fetch(`${endpoint}/factions`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + headers.token,
        Cookie: headers.cookies,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const lastEvent = result.recentEvents[0];
    const event = new Event(
      lastEvent.id,
      new Date(lastEvent.startDate),
      new Date(lastEvent.endDate),
    );
    event.name = lastEvent.name;
    const points: EventPoint[] = [];
    for (const jsonPoint of lastEvent.points) {
      const point = new EventPoint(jsonPoint.faction, jsonPoint.points);
      points.push(point);
    }

    event.points = points;
    return event;
  } catch (error) {
    throw error;
  }
}

export async function eventInfo(id: string, previousHeaders: any) {
  const headers = previousHeaders;

  try {
    const response = await fetch(
      `${endpoint}/faction/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + headers.token,
          Cookie: headers.cookies,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const event = new Event(result.id, new Date(result.startDate), new Date(result.endDate));
    event.name = result.name;
    event.temple = result.temple;
    event.players = result.players;
    event.playersRef = {};
    for (const ref of Object.keys(result.playersRef)) {
      const playerData = result.playersRef[ref];
      const player = new Player(playerData.id);
      player.lastActivityDate = new Date(Date.parse(playerData.lastActivityDate));
      player.factionLastActivityDate = new Date(Date.parse(playerData.factionLastActivityDate));
      player.name = playerData.name;
      player.power = playerData.power;
      player.role = playerData.role;
      player.faction = new Faction(playerData.faction.id);
      event.playersRef[ref] = player;
    }
  } catch (error) {
    throw error;
  }
}
