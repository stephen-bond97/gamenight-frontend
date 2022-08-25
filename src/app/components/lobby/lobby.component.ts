import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { SocketService } from 'src/app/services/socket.service';
import { TriviaStateService } from 'src/app/services/trivia-state.service';
import { InformationContainer } from 'src/typings/informationContainer';
import { InformationType } from 'src/typings/informationType.enum';
import { PlayerInfo } from 'src/typings/playerInfo';
import { SynchronisationType } from 'src/typings/synchronisationType.enum';
import { SynchroniseContainer } from 'src/typings/synchroniseContainer';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GameStateService } from 'src/app/services/game-state.service';
import { WheelOfFortuneStateService } from 'src/app/services/wheel-of-fortune.state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  public LobbyCode = "";
  public get Players(): PlayerInfo[] { return this.gameState.Players; }
  public get IsHost(): boolean { return this.socketService.IsHost; }

  constructor(
    private triviaState: TriviaStateService,
    private gameState: GameStateService,
    private socketService: SocketService,
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.LobbyCode = this.socketService.LobbyCode;

    if (this.socketService.IsHost == true && this.appService.PlayerInfo) {
      this.gameState.Players.push(this.appService.PlayerInfo);

      this.socketService.InformationShared
        .pipe(untilDestroyed(this))
        .subscribe((infoContainer) => this.handleInformationShared(infoContainer));
    }
    else {
      this.socketService.LobbySynchronised
        .pipe(untilDestroyed(this))
        .subscribe((syncContainer) => this.handleSynchronisation(syncContainer));
    }
  }

  public copyToClipboard(input: HTMLInputElement, event: MouseEvent): void {
    event.stopPropagation();

    input.select();
    document.execCommand('copy');
    input.setSelectionRange(0, 0);
  }

  private handleInformationShared(infoContainer: InformationContainer): void {
    if (infoContainer.InformationType == InformationType.PlayerInfo) {
      this.gameState.Players.push(infoContainer.Data);

      // host raises synchronisation event with rest of lobby
      this.socketService.SynchroniseLobby({
        SynchronisationType: SynchronisationType.Players,
        Data: this.gameState.Players
      });
    }
  }

  private handleSynchronisation(syncContainer: SynchroniseContainer<any>): void {
    switch (syncContainer.SynchronisationType) {

      case SynchronisationType.Players:
        this.gameState.Players.length = 0;
        this.gameState.Players.push(...syncContainer.Data);
        break;

      case SynchronisationType.GameStarted:
        if (window.location.pathname.includes("trivia")) {
          this.triviaState.CurrentQuestion = syncContainer.Data;
        }
        
        this.router.navigate(["../game"], { relativeTo: this.route });
        break;

      default:
        break;
    }
  }
}
