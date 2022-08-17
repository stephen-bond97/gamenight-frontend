import { PlayerInfo } from "src/typings/playerInfo";
import { TriviaQuestion } from "src/typings/triviaQuestion";

export class TriviaStateService {
    public LobbyCode = "";
    public Players: PlayerInfo[] = [];
    public NumberOfRounds = 0;
    public GameStarted: boolean = false;
    public CurrentQuestion: TriviaQuestion | null = null;
}