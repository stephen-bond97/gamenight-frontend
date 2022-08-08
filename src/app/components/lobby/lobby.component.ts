import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { SocketService } from 'src/app/services/socket.service';
import { TriviaStateService } from 'src/app/services/trivia-state.service';
import { InformationContainer } from 'src/typings/informationContainer';
import { InformationType } from 'src/typings/informationType.enum';
import { PlayerInfo } from 'src/typings/playerInfo';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  public LobbyCode = "";
  public ShowLobbyCode = false;
  public get Players(): PlayerInfo[] { return this.triviaState.Players; }

  constructor(private triviaState: TriviaStateService, private socketService: SocketService, private appService: AppService) { }

  ngOnInit(): void {
    this.LobbyCode = this.triviaState.LobbyCode;
    if (this.socketService.IsHost == true) {
      this.ShowLobbyCode = true;
      this.triviaState.Players.push(this.appService.PlayerInfo);

      this.socketService.InformationShared.subscribe((infoContainer) => this.handleInformationShared(infoContainer));
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
    }
  }
}
