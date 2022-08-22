import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { PhraseCategory } from "src/typings/phraseCategory.enum";

@Injectable()
export class PhraseService {
    private readonly LANDMARKS = ["Eiffel Tower"];
    private readonly PEOPLE = ["The Rock"];
    private readonly MUSIC = ["A Perfect Circle"];
    private readonly VIDEO_GAMES = ["Rocket League"];
    private readonly TV_SHOWS = ["The Boys"];

    /**
     *
     */
    constructor(private http: HttpClient) {

    }

    public GetPhrase(phraseCategory: PhraseCategory): Observable<string> {
        let result = "";
        switch (phraseCategory) {
            case PhraseCategory.Landmarks:
                result = this.LANDMARKS[0];
                break;
            case PhraseCategory.People:
                result = this.PEOPLE[0];
                break;
            case PhraseCategory.Music:
                result = this.MUSIC[0];
                break;
            case PhraseCategory.VideoGames:
                result = this.VIDEO_GAMES[0];
                break;
            case PhraseCategory.TVShows:
                result = this.TV_SHOWS[0];
                break;
            default:
                break;
        }

        return of(result);
    }
}