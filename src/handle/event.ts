import Faction from './faction';

export class EventPoint {
  public faction: Faction;
  public points: number;

  constructor(faction, points) {
    this.faction = faction;
    this.points = points;
  }
}

class Event {
  public id: string;
  public name?: string;
  public startDate: Date;
  public endDate: Date;
  public points?: EventPoint[];

  constructor(id: string, startDate: Date, endDate: Date) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export default Event;
