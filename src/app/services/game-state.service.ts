import { Injectable } from "@angular/core";
import { PlayerInfo } from "src/typings/playerInfo";

@Injectable()
export class GameStateService {    
    public Players: PlayerInfo[] = [];
    public NumberOfRounds = 0;
    public GameStarted: boolean = false;
}