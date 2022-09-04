import { ComponentFixture, TestBed } from '@angular/core/testing';
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

import { LobbyComponent } from './lobby.component';

describe('LobbyComponent', () => {
    let component: LobbyComponent;
    let fixture: ComponentFixture<LobbyComponent>;

    class MatSnackBarSpy {}

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
                    useValue: { }
                }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(LobbyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
