import md5 from 'md5';
import Player from './player';
import Faction from './faction';
import Event from './event';
import { EventPoint } from './event';

const endpoint = 'https://www.pactify.fr/api';
const headerSite = 'https://www.pactify.fr';

export async function searchPlayer(username, previousHeaders) {
    const headers = previousHeaders;

    try {
        const response = await fetch(`${endpoint}/player/search?name=${encodeURIComponent(username.toLowerCase())}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + headers.token,
                'Cookie': headers.cookies,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if ('current' in result) {
            return result;
        } else {
            return undefined;
            //throw new Error('Player not found'); // or use your custom error handling
        }
    } catch (e) {
        console.log(e)
        throw e; // Handle error
    }
}

export async function playerInfos(id: string, previousHeaders: any) {
    const headers = previousHeaders;

    try {
        const response = await fetch(`${endpoint}/player/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + headers.token,
                'Cookie': headers.cookies,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const player = new Player(id);

        // Map the result to the player object
        player.name = result.name;
        player.power = result.power;
        player.onlineServer = result.onlineServer;
        player.role = result.role;
        player.rank = result.rank;
        player.headUrl = result.headUrl;
        player.online = result.online;

        if ('registrationDate' in result) {
            player.registrationDate = new Date(Date.parse(result.registrationDate));
        }
        if ('lastActivityDate' in result) {
            player.lastActivityDate = new Date(Date.parse(result.lastActivityDate));
        }
        if ('factionLastActivityDate' in result) {
            player.factionLastActivityDate = new Date(Date.parse(result.factionLastActivityDate));
        }
        if ('faction' in result) {
            const faction: Faction = new Faction(result.faction.id);
            faction.name = result.faction.name;
            if (result.icon) {
                faction.icon = result.faction.icon;
            } else {
                faction.icon = "🏳";
            }
            console.log('icon: ' + faction.icon)
            if ('creationDate' in result.faction) {
                faction.creationDate = new Date(Date.parse(result.faction.creationDate));
            }
            if ('firstDay' in result.faction) {
                faction.firstDay = new Date(Date.parse(result.faction.firstDay));
            }
            if ('lastDay' in result.faction) {
                faction.lastDay = new Date(Date.parse(result.faction.lastDay));
            }
            player.faction = faction;
        }

        return result;
    } catch (error) {
        throw error;
    }
}



export async function searchFaction(name, previousHeaders) {
    const headers = previousHeaders;

    try {
        const response = await fetch(`${endpoint}/faction/search?name=${encodeURIComponent(name.toLowerCase())}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + headers.token,
                'Cookie': headers.cookies,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if ('current' in result) {
            for (let hist of result.history) {
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

/**
 * Fetch faction infos
 * @param {string} name Faction ID
 * @param {string} previousHeaders 
 * @returns {Promise<FactionSearchResult>}
 */
export async function factionInfos(id, previousHeaders) {
    const headers = previousHeaders;

    try {
        const response = await fetch(`${endpoint}/faction/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + headers.token,
                'Cookie': headers.cookies,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const faction = new Faction(id);
        // Map the result to the faction object
        if ('creationDate' in result) {
            faction.creationDate = new Date(Date.parse(result.creationDate));
        }
        if ('firstDay' in result) {
            faction.firstDay = new Date(Date.parse(result.firstDay));
        }
        if ('lastDay' in result) {
            faction.lastDay = new Date(Date.parse(result.lastDay));
        }
        if ('statesHistory' in result) {
            for (let state of result.statesHistory) {
                state.day = new Date(Date.parse(state.day));
            }
        }
        faction.name = result.name;
        faction.description = result.description;
        faction.icon = result.icon;

        if ('membersRef' in result) {
            for (let ref of Object.keys(result.membersRef)) {
                result.membersRef[ref].lastActivityDate = new Date(Date.parse(result.membersRef[ref].lastActivityDate));
                result.membersRef[ref].factionLastActivityDate = new Date(Date.parse(result.membersRef[ref].factionLastActivityDate));
            }
        }

        return result;
    } catch (error) {
        throw error;
    }
}

export async function getLastEvent(previousHeaders: any) {
    const headers = previousHeaders;

    try {
        const response = await fetch(`${endpoint}/factions`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + headers.token,
                'Cookie': headers.cookies,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const lastEvent = result.recentEvents[0];
        const event = new Event(lastEvent.id, new Date(lastEvent.startDate), new Date(lastEvent.endDate));
        event.name = lastEvent.name;
        const points: EventPoint[] = [];
        for (let jsonPoint of lastEvent.points) {
            const point = new EventPoint(jsonPoint.faction, jsonPoint.points);
            points.push(point);
        }

        event.points = points;
        return event;

    } catch (error) {
        throw error;
    }
}

