import Faction from "./faction";
import { searchPlayer, playerInfos } from "./fetch";

class Player {
  public id: string;
  public name?: string;
  public registrationDate?: Date;
  public lastActivityDate?: Date;
  public factionLastActivityDate?: Date;
  public activityTime?: number;
  public rank?: string;
  public power?: number;
  public role?: string;
  public faction?: Faction;
  public online?: boolean;
  public onlineServer?: string;
  public headUrl?: string;

  constructor(id: string) {
    this.id = id;
  }

}

export async function getPlayer(username: string, header: object) {
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
