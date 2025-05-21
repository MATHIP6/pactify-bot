//import fetch from './fetch';
import Player from "./player";
import { searchFaction, factionInfos } from "./fetch";

interface FactionState {
  day: Date;
  name: string;
  power: number;
  powerLow: number;
  maxPower: number;
  claimsCount: number;
  claimsCountLow: number;
  claimsCountHigh: number;
  claimsApCount: number;
  claimsApCountLow: number;
  claimsApCountHigh: number;
  membersCount: number;
  members: Player[];
  alliesCount: number;
  allies: Faction[];
}

class Faction {
  public id: string;
  public name?: string;
  public icon: string;
  public description?: string;
  public creationDate?: Date;
  public firstDay?: Date;
  public lastDay?: Date;
  public statesHistory?: FactionState[];
  public membersRef?: { [key: string]: Player };

  constructor(id: string) {
    this.id = id;
    this.icon = "🏳";
  }
}

export async function getFaction(name: string, headers: any) {
  try {
    const factionID = await searchFaction(name, headers);
    if (!factionID) {
      return undefined;
    }
    const faction = await factionInfos(factionID.current, headers);
    return faction;
  } catch (e) {
    throw e;
  }
}

export default Faction;
