import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { GameStateService } from 'src/app/services/game-state.service';
import { PhraseService } from 'src/app/services/phrase.service';
import { SocketService } from 'src/app/services/socket.service';
import { WheelOfFortuneStateService } from 'src/app/services/wheel-of-fortune.state.service';
import { InformationContainer } from 'src/typings/informationContainer';
import { InformationType } from 'src/typings/informationType.enum';
import { PlayerInfo } from 'src/typings/playerInfo';
import { SynchronisationType } from 'src/typings/synchronisationType.enum';
import { SynchroniseContainer } from 'src/typings/synchroniseContainer';

@Component({
  selector: 'app-wheel-of-fortune-game',
  templateUrl: './wheel-of-fortune-game.component.html',
  styleUrls: ['./wheel-of-fortune-game.component.scss']
})
export class WheelOfFortuneComponent implements OnInit {
  public AnswerChoices: string[] = [];

  public LetterChoice = "";

  public get CurrentPhrase(): string[] {
    return this.wheelStateService.CurrentPhrase.split("");
  }

  public get CurrentPlayer(): PlayerInfo | null {
    return this.wheelStateService.SelectedPlayer;
  }

  public get IsCurrentPlayer(): boolean {
    return this.CurrentPlayer?.Name == this.appService.PlayerInfo?.Name;
  }


  constructor(
    private wheelStateService: WheelOfFortuneStateService,
    private gameState: GameStateService,
    private phraseService: PhraseService,
    private appService: AppService,
    private socketService: SocketService) { }

  ngOnInit(): void {
    if (!this.socketService.IsHost) {
      this.socketService.LobbySynchronised.subscribe((syncContainer) => this.handleLobbySynchronised(syncContainer));
    }
    else {
      this.socketService.InformationShared.subscribe((infoContainer) => this.handleInformationShared(infoContainer));
      this.phraseService.Phrase().subscribe((phrase) => this.handlePhraseReceived(phrase));
    }
  }

  public IsLetterSelected(letter: string): boolean {
    return this.AnswerChoices.includes(letter);
  }

  public SelectLetter(): void {
    if (this.socketService.IsHost) {
      this.AnswerChoices.push(this.LetterChoice);
      this.socketService.SynchroniseLobby({
        SynchronisationType: SynchronisationType.AnswerChoices,
        Data: this.AnswerChoices
      });

      this.selectPlayerForTurn();
    }
    else {
      this.socketService.ShareInformation({
        InformationType: InformationType.LetterChoice,
        Data: this.LetterChoice
      });
    }
  }

  private handleLobbySynchronised(syncContainer: SynchroniseContainer<any>): void {
    switch (syncContainer.SynchronisationType) {
      case SynchronisationType.PlayerTurn:
        this.wheelStateService.SelectedPlayer = syncContainer.Data
        break;

      case SynchronisationType.AnswerChoices:
        this.AnswerChoices.length = 0;
        this.AnswerChoices.push(...syncContainer.Data);
        break;

      default:
        break;
    }
  }

  private handleInformationShared(infoContainer: InformationContainer): void {
    switch (infoContainer.InformationType) {
      case InformationType.LetterChoice:
        this.AnswerChoices.push(infoContainer.Data);
        this.socketService.SynchroniseLobby({
          SynchronisationType: SynchronisationType.AnswerChoices,
          Data: this.AnswerChoices
        });

        this.selectPlayerForTurn();
        break;

      default:
        break;
    }
  }

  private handlePhraseReceived(phrase: string): void {
    this.wheelStateService.CurrentPhrase = phrase;

    let syncType = SynchronisationType.GameStarted;
    this.socketService.SynchroniseLobby({
      SynchronisationType: syncType,
      Data: phrase
    });

    this.selectPlayerForTurn();
  }

  private selectPlayerForTurn(): void {
    let size = this.gameState.Players.length;
    let player = this.gameState.Players.at(Math.floor(Math.random() * size));

    this.wheelStateService.SelectedPlayer = player!;

    this.socketService.SynchroniseLobby({
      SynchronisationType: SynchronisationType.PlayerTurn,
      Data: player
    })
  }
}
