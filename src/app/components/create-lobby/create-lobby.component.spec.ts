import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppService } from 'src/app/services/app.service';
import { GameStateService } from 'src/app/services/game-state.service';
import { SocketService } from 'src/app/services/socket.service';
import { AppServiceSpy } from 'src/testing/spies/app.service.spy';
import { GameStateServiceSpy } from 'src/testing/spies/game-state.service.spy';
import { SocketServiceSpy } from 'src/testing/spies/socket.service.spy';

import { CreateLobbyComponent } from './create-lobby.component';

describe('CreateLobbyComponent', () => {
  let component: CreateLobbyComponent;
  let fixture: ComponentFixture<CreateLobbyComponent>;
  let componentElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CreateLobbyComponent],
      providers: [
        { provide: GameStateService, useClass: GameStateServiceSpy },
        { provide: SocketService, useClass: SocketServiceSpy },
        { provide: AppService, useClass: AppServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    componentElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call socket service create lobby when create lobby button is clicked', () => {
    
    // arrange
    let button = componentElement.querySelector('button') as HTMLButtonElement;
    let appServiceSpy = TestBed.inject(AppService);
    let socketServiceSpy = TestBed.inject(SocketService);

    // act
    button.click();

    // assert
    expect(appServiceSpy.SetLoading).toHaveBeenCalledOnceWith(true);
    expect(socketServiceSpy.CreateLobby).toHaveBeenCalledTimes(1);
  });

  it('should handle lobby created event from socket service', () => {
    
    // arrange
    let socketServiceSpy = TestBed.inject(SocketService);
    let appServiceSpy = TestBed.inject(AppService);
    let gameStateServiceSpy = TestBed.inject(GameStateService);
    let routerSpy = TestBed.inject(Router);
    routerSpy.navigate = jasmine.createSpy("navigate");
    component.numberOfRounds = 1;

    // act
    socketServiceSpy.LobbyCreated.next("testlobbycode");
    fixture.detectChanges();

    // assert
    expect(appServiceSpy.SetLoading).toHaveBeenCalledOnceWith(false);
    expect(socketServiceSpy.LobbyCode).toBe("testlobbycode");
    expect(gameStateServiceSpy.NumberOfRounds).toBe(1);
    expect(socketServiceSpy.SetHost).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
  });
});
