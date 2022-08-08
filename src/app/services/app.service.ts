import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { PlayerInfo } from "src/typings/playerInfo";

@Injectable()
export class AppService {
    public PlayerInfo: PlayerInfo = {
        Name: "bob"
    };

    public LoadingStateChange = new Subject<boolean>();

    public SetLoading(isLoading: boolean): void {
        this.LoadingStateChange.next(isLoading);
    }
}