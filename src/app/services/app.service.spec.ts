import { PlayerInfo } from "src/typings/playerInfo";
import { AppService } from "./app.service";

class StorageHelperSpy {
    PlayerInfo = jasmine.createSpy("PlayerInfo");
    UpdateProfile = jasmine.createSpy("UpdateProfile");
}

describe('AppService', () => {
    let appService: AppService;
    let storageHelperSpy = new StorageHelperSpy() as any;

    beforeEach(() => {
        appService = new AppService(storageHelperSpy);
    });

    it('should create', () => {
        expect(appService).toBeTruthy();
    });

    it('should call storage helper when updating profile', () => {
        
        // arrange
        let playerInfo: PlayerInfo = {
            Name: "test",
            Avatar: "fox",
            Score: 0
        }

        // act
        appService.UpdateProfile(playerInfo);

        // assert
        expect(storageHelperSpy.UpdateProfile).toHaveBeenCalledOnceWith({
            Name: "test",
            Avatar: "fox",
            Score: 0
        });
    });

    it('should raise setLoading event when method is called', () => {
        
        // arrange
        spyOn(appService.LoadingStateChange, 'next');

        // act
        appService.SetLoading(true);

        // assert
        expect(appService.LoadingStateChange.next).toHaveBeenCalledOnceWith(true);
    });
});