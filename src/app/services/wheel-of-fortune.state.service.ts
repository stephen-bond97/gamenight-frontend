import { Injectable } from "@angular/core";
import { PlayerInfo } from "src/typings/playerInfo";

@Injectable()
export class WheelOfFortuneStateService {
    public CurrentPhrase = "";
    public SelectedPlayer: PlayerInfo | null = null;
}