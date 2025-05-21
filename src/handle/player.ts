import Faction from "./faction";
import { searchPlayer, playerInfos } from "./fetch";

class Player {
  public id: any;
  public name: string;
  public registrationDate: Date;
  public lastActivityDate: Date;
  public factionLastActivityDate: Date;
  public activityTime: number;
  public rank: String;
  public power: Number;
  public role: String;
  public faction: any;
  public online: boolean;
  public onlineServer: String;
  public headUrl: string;

  constructor(id: any) {
    this.id = id;
    this.name = "";
    this.registrationDate = new Date();
    this.lastActivityDate = new Date();
    this.factionLastActivityDate = new Date();
    this.activityTime = 0;
    this.rank = "";
    this.power = 0;
    this.role = "";
    this.faction = undefined;
    this.online = false;
    this.onlineServer = "";
    this.headUrl = "";
  }

  /**
   * Fetch player infos
   */
  /*async fetch(): Promise<void> {
    const result = await fetch.playerInfos(this.id, header);
  }*/
}

export async function getPlayer(username: String, header: Object) {
  try {
    const playerID = await searchPlayer(username, header);
    if (!playerID) {
      return undefined;
    }
    const player = await playerInfos(playerID.current, header);
    return player;
  } catch (e) {
    throw e;
  }
}

export default Player;
