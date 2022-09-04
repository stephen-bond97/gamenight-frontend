import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppService } from 'src/app/services/app.service';
import { GameStateService } from 'src/app/services/game-state.service';
import { SocketService } from 'src/app/services/socket.service';
import { TriviaStateService } from 'src/app/services/trivia-state.service';
import { AppServiceSpy } from 'src/testing/spies/app.service.spy';
import { GameStateServiceSpy } from 'src/testing/spies/game-state.service.spy';
import { SocketServiceSpy } from 'src/testing/spies/socket.service.spy';
import { TriviaStateServiceSpy } from 'src/testing/spies/trivia-state.service.spy';
import { InformationType } from 'src/typings/informationType.enum';
import { PlayerInfo } from 'src/typings/playerInfo';
import { SynchronisationType } from 'src/typings/synchronisationType.enum';

import { LobbyComponent } from './lobby.component';

describe('LobbyComponent', () => {
    let component: LobbyComponent;
    let fixture: ComponentFixture<LobbyComponent>;
    let componentElement: HTMLElement;

    class MatSnackBarSpy { }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [LobbyComponent],
            providers: [
                { provide: GameStateService, useClass: GameStateServiceSpy },
                { provide: TriviaStateService, useClass: TriviaStateServiceSpy },
                { provide: SocketService, useClass: SocketServiceSpy },
                { provide: AppService, useClass: AppServiceSpy },
                { provide: MatSnackBar, useClass: MatSnackBarSpy },
                {
                    provide: ActivatedRoute,
                    useValue: {}
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(LobbyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        componentElement = fixture.debugElement.nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show lobby code and share fields if player is host', () => {

        // arrange
        let socketServiceSpy = TestBed.inject(SocketService) as SocketServiceSpy;
        socketServiceSpy.IsHost = true;

        // act
        fixture.detectChanges();

        // assert
        let inputs = componentElement.querySelectorAll('div > input');

        let firstInput = inputs[0] as HTMLInputElement;
        let secondInput = inputs[1] as HTMLInputElement;

        expect(firstInput.value).toBe("testlobby123");
        expect(secondInput.value).toContain("/join/testlobby123");
    });

    it('should not show lobby code if player is not host', () => {

        // arrange
        let socketServiceSpy = TestBed.inject(SocketService) as SocketServiceSpy;
        socketServiceSpy.IsHost = false;

        // act
        fixture.detectChanges();

        // assert
        let inputs = componentElement.querySelectorAll('div > input');
        expect(inputs.length).toBe(0);
    });

    it('should show host in the players list', () => {
        
        // arrange
        let appServiceSpy = TestBed.inject(AppService);
        appServiceSpy.PlayerInfo!.Name = "Test Host";
        fixture.detectChanges();
        
        // assert
        let div = componentElement.querySelector('.players-display > div') as HTMLDivElement;
        expect(div.innerText).toContain(`Test Host has joined the game`);
    });

    it('should show joined players in the players list', fakeAsync(() => {

        // arrange
        let socketServiceSpy = TestBed.inject(SocketService) as SocketServiceSpy;
        let playerInfo: PlayerInfo = {
            Name: "Test Player2",
            Avatar: "path/to/image2.png",
            Score: 0
        };

        // act
        socketServiceSpy.InformationShared.next({
            InformationType: InformationType.PlayerInfo,
            Data: playerInfo
        });
        tick();
        fixture.detectChanges();

        // assert
        let player = componentElement.querySelectorAll('.players-display > div')[1] as HTMLDivElement;
        expect(player.innerText).toContain("Test Player2");
    }));

    it('should synchronise the lobby if the host is informed of a new player joining', fakeAsync(() => {

        // arrange
        let socketServiceSpy = TestBed.inject(SocketService) as SocketServiceSpy;
        let playerInfo: PlayerInfo = {
            Name: "Test Player2",
            Avatar: "path/to/image2.png",
            Score: 0
        };

        // act
        socketServiceSpy.InformationShared.next({
            InformationType: InformationType.PlayerInfo,
            Data: playerInfo
        });
        tick();
        fixture.detectChanges();

        // assert
        expect(socketServiceSpy.SynchroniseLobby).toHaveBeenCalledOnceWith({
            SynchronisationType: SynchronisationType.Players,
            Data: [{
                Name: "Test User",
                Avatar: "path/to/image.png",
                Score: 0
            }, {
                Name: "Test Player2",
                Avatar: "path/to/image2.png",
                Score: 0
            }]
        });
    }));
});
