import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { PhraseCategory } from "src/typings/phraseCategory.enum";
import { Utils } from "src/utils";

@Injectable()
export class PhraseService {
    private LANDMARKS = ["Eiffel Tower", "The Great Wall of China", "Statue of Liberty", "Kremlin", "Sydney Opera House", "Taj Mahal", "Burj Khalifa", "Machu Picchu", "The Acropolis", "Easter Island", "Golden Gate Bridge", "Giant's Causeway", "Christ the Redeemer"];
    private PEOPLE = ["The Rock", "Helen Keller", "William Shakespeare", "Billie Eilish", "Bill Gates", "Elvis Presley", "Queen Victoria", "Pope Francis", "Walt Disney", "John Lennon", "Lionel Messi", "Tiger Woods"];
    private MUSIC = ["A Perfect Circle", "Eminem", "Michael Jackson", "Biggie Smalls", "Metallica", "Jimi Hendrix", "Eddie Van Halen", "Elton John", "David Bowie", "Johnny Cash", "Lynyrd Skynyrd", "Led Zeppelin", "Pink Floyd", "The Who"];
    private VIDEO_GAMES = ["Rocket League", "Destiny", "Fifa", "World Of Warcraft", "Battlefield", "Call of Duty", "Pokemon", "Tomb Raider", "Half Life", "Portal", "Fortnite", "Minecraft", "Team Fortress", "Far Cry", "Bloodborne", "Dark Souls"];
    private TV_SHOWS = ["The Boys", "Eastenders", "Coronation Street", "Invincible", "Star Trek", "Battlestar Galactica", "Family Guy", "South Park", "The Simpsons", "The Walking Dead", "Game of Thrones", "Stranger Things", "Orange is the New Black"];

    /**
     *
     */
    constructor(private http: HttpClient) {
        this.LANDMARKS = Utils.Shuffle(this.LANDMARKS);
        this.PEOPLE = Utils.Shuffle(this.PEOPLE);
        this.MUSIC = Utils.Shuffle(this.MUSIC);
        this.VIDEO_GAMES = Utils.Shuffle(this.VIDEO_GAMES);
        this.TV_SHOWS = Utils.Shuffle(this.TV_SHOWS);
    }

    public GetPhrase(phraseCategory: PhraseCategory): Observable<string> {
        let result = "";
        switch (phraseCategory) {
            case PhraseCategory.Landmarks:
                result = this.LANDMARKS.pop()!;
                break;
            case PhraseCategory.People:
                result = this.PEOPLE.pop()!;
                break;
            case PhraseCategory.Music:
                result = this.MUSIC.pop()!;
                break;
            case PhraseCategory.VideoGames:
                result = this.VIDEO_GAMES.pop()!;
                break;
            case PhraseCategory.TVShows:
                result = this.TV_SHOWS.pop()!;
                break;
            default:
                break;
        }

        return of(result);
    }
}