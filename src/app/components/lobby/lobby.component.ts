import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { SocketService } from 'src/app/services/socket.service';
import { TriviaStateService } from 'src/app/services/trivia-state.service';
import { InformationContainer } from 'src/typings/informationContainer';
import { InformationType } from 'src/typings/informationType.enum';
import { PlayerInfo } from 'src/typings/playerInfo';
import { SynchronisationType } from 'src/typings/synchronisationType.enum';
import { SynchroniseContainer } from 'src/typings/synchroniseContainer';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  public LobbyCode = "";
  public get Players(): PlayerInfo[] { return this.triviaState.Players; }
  public get IsHost(): boolean { return this.socketService.IsHost; }

  constructor(private triviaState: TriviaStateService, private socketService: SocketService, private appService: AppService) { }

  ngOnInit(): void {
    this.LobbyCode = this.triviaState.LobbyCode;

    if (this.socketService.IsHost == true && this.appService.PlayerInfo ) {
      this.triviaState.Players.push(this.appService.PlayerInfo);

      this.socketService.InformationShared.subscribe((infoContainer) => this.handleInformationShared(infoContainer));
    }
    else {
      this.socketService.LobbySynchronised.subscribe((syncContainer) => this.handleSynchronisation(syncContainer));
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
      this.triviaState.Players.push(infoContainer.Data);

      // host raises synchronisation event with rest of lobby
      let syncContainer: SynchroniseContainer = {
        SynchronisationType: SynchronisationType.Players,
        Data: this.triviaState.Players
      };

      this.socketService.SynchroniseLobby(syncContainer);
    }
  }

  private handleSynchronisation(syncContainer: SynchroniseContainer): void {
    if (syncContainer.SynchronisationType == SynchronisationType.Players) {
      this.triviaState.Players.length = 0;
      this.triviaState.Players.push(...syncContainer.Data);
    }
  }
}
