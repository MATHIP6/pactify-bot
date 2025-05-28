import Faction from "./faction";
import Player from "./player";

export class EventPoint {
  public faction: Faction;
  public points: number;

  constructor(faction: Faction, points: number) {
    this.faction = faction;
    this.points = points;
  }
}

export class PlayerEvent {
  public id: string;
  public factionId: string;
  public secs: number;
  public secsM: number;
  public totemBreak: number;

  constructor(id: string, factionId: string, secs: number, secsM: number, totemBreak = 0) {
    this.id = id;
    this.factionId = factionId;
    this.secs = secs;
    this.secsM = secsM;
    this.totemBreak = totemBreak;
  }
}

class Event {
  public id: string;
  public name?: string;
  public startDate: Date;
  public endDate: Date;
  public points?: EventPoint[];
  public temple?: string;
  public players?: PlayerEvent[];
  public playersRef?: { [key: string]: Player };

  constructor(id: string, startDate: Date, endDate: Date) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export default Event;
