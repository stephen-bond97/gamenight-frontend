import { Subject } from "rxjs";
import { PlayerInfo } from "src/typings/playerInfo";

export class AppServiceSpy {
    PlayerInfo: PlayerInfo = {
        Name: "Test User",
        Avatar: "path/to/image.png",
        Score: 0
    };

    SetLoading = jasmine.createSpy("SetLoading");

    UpdateProfile = jasmine.createSpy("UpdateProfile");

    LoadingStateChange = new Subject<boolean>();
  }