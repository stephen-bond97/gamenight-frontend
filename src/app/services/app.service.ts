import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { PlayerInfo } from "src/typings/playerInfo";
import { StorageService } from "./storage.service";

@Injectable()
export class AppService {
    public PlayerInfo: PlayerInfo | null = null;

    public LoadingStateChange = new Subject<boolean>();

    /**
     *
     */
    public constructor(private storageHelper: StorageService) {
        this.PlayerInfo = this.storageHelper.PlayerInfo;
    }

    public UpdateProfile(playerInfo: PlayerInfo): void {
        this.storageHelper.UpdateProfile(playerInfo);
        this.PlayerInfo = this.storageHelper.PlayerInfo;
    }

    public SetLoading(isLoading: boolean): void {
        this.LoadingStateChange.next(isLoading);
    }
}