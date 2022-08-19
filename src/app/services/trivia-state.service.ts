import { Injectable } from "@angular/core";
import { PlayerInfo } from "src/typings/playerInfo";
import { TriviaQuestion } from "src/typings/triviaQuestion";



@Injectable()
export class TriviaStateService {
    public CurrentQuestion: TriviaQuestion | null = null;
    public SelectedCategory = "";
}