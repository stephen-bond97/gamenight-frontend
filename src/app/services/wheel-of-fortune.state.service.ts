import { Injectable } from "@angular/core";
import { PhraseCategory } from "src/typings/phraseCategory.enum";
import { PlayerInfo } from "src/typings/playerInfo";

@Injectable()
export class WheelOfFortuneStateService {
    public CurrentPhrase = "";
    public SelectedPlayer: PlayerInfo | null = null;
    public SelectedCategory: PhraseCategory | null = null;
}