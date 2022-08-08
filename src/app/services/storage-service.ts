import { Injectable } from "@angular/core";
import { PlayerInfo } from "src/typings/playerInfo";

@Injectable()
export class StorageService {
    private readonly PROFILE = 'gamenight-profile';
    private playerInfo: PlayerInfo | null = null;

    public get PlayerInfo(): PlayerInfo | null {
        if (!this.playerInfo) {
            let storageInfo = localStorage.getItem(this.PROFILE);

            if (storageInfo) {
                this.playerInfo = JSON.parse(storageInfo);
            }
        }

        return this.playerInfo;
    }

    public UpdateProfile(playerInfo: PlayerInfo): void {
		localStorage.setItem(this.PROFILE, JSON.stringify(playerInfo));
    }
}