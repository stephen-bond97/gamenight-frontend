import { PlayerInfo } from "src/typings/playerInfo";

export class GameStateServiceSpy {
    Players: PlayerInfo[] = [];
    NumberOfRounds = jasmine.createSpy("NumberOfRounds");
}