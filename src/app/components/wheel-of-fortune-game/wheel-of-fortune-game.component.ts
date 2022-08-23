import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, delay } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { GameStateService } from 'src/app/services/game-state.service';
import { PhraseService } from 'src/app/services/phrase.service';
import { SocketService } from 'src/app/services/socket.service';
import { WheelOfFortuneStateService } from 'src/app/services/wheel-of-fortune.state.service';
import { InformationContainer } from 'src/typings/informationContainer';
import { InformationType } from 'src/typings/informationType.enum';
import { PhraseCategory } from 'src/typings/phraseCategory.enum';
import { PlayerInfo } from 'src/typings/playerInfo';
import { SynchronisationType } from 'src/typings/synchronisationType.enum';
import { SynchroniseContainer } from 'src/typings/synchroniseContainer';
import { Utils } from 'src/utils';
import { SolvePhraseComponent } from './solve-phrase/solve-phrase.component';

@Component({
  selector: 'app-wheel-of-fortune-game',
  templateUrl: './wheel-of-fortune-game.component.html',
  styleUrls: ['./wheel-of-fortune-game.component.scss']
})
export class WheelOfFortuneComponent implements OnInit {
  private readonly PHRASES_PER_ROUND = 3;
  private currentPlayerIndex = 0;

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

  public get SelectedCategory(): PhraseCategory | null {
    return this.wheelStateService.SelectedCategory;
  }

  public get NumberOfRounds(): number {
    return this.gameState.NumberOfRounds;
  }

  public RoundsCompleted = 0;

  constructor(
    private wheelStateService: WheelOfFortuneStateService,
    private gameState: GameStateService,
    private phraseService: PhraseService,
    private appService: AppService,
    private socketService: SocketService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (!this.socketService.IsHost) {
      this.socketService.LobbySynchronised.subscribe((syncContainer) => this.handleLobbySynchronised(syncContainer));
    }
    else {
      this.socketService.InformationShared.subscribe((infoContainer) => this.handleInformationShared(infoContainer));

      this.socketService.SynchroniseLobby({
        SynchronisationType: SynchronisationType.GameStarted
      });

      this.getRandomCategory();

      this.selectPlayerForTurn();
    }
  }

  public IsLetterSelected(letter: string): boolean {
    return this.AnswerChoices.includes(letter);
  }

  public SelectLetter(): void {
    if (this.AnswerChoices.includes(this.LetterChoice)) {
      this.LetterChoice = "";
      return;
    }

    if (this.socketService.IsHost) {
      this.AnswerChoices.push(this.LetterChoice.toLowerCase());
      this.socketService.SynchroniseLobby({
        SynchronisationType: SynchronisationType.AnswerChoices,
        Data: this.AnswerChoices
      });

      if (this.CurrentPhrase.includes(this.LetterChoice)) {
        this.wheelStateService.SelectedPlayer!.Score++;
      }

      this.socketService.SynchroniseLobby({
        SynchronisationType: SynchronisationType.Players,
        Data: this.gameState.Players
      });

      this.selectPlayerForTurn();
    }
    else {
      this.socketService.ShareInformation({
        InformationType: InformationType.LetterChoice,
        Data: this.LetterChoice.toLowerCase()
      });
    }

    this.LetterChoice = "";
  }

  public HandleSolveClick(): void {
    this.dialog.open(SolvePhraseComponent, {
      enterAnimationDuration: "500ms",
      exitAnimationDuration: "100ms",
      disableClose: true
    });
  }

  private getRandomCategory(): void {
    this.wheelStateService.SelectedCategory = null;

    this.getRandomEnum(PhraseCategory).subscribe((r) => {
      this.wheelStateService.SelectedCategory = r;
      
      this.socketService.SynchroniseLobby({
        SynchronisationType: SynchronisationType.CategorySelected,
        Data: this.wheelStateService.SelectedCategory
      });
  
      this.phraseService.GetPhrase(this.wheelStateService.SelectedCategory).subscribe((phrase) => this.handlePhraseReceived(phrase));
    });
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

      case SynchronisationType.NewPhrase:
        this.wheelStateService.CurrentPhrase = syncContainer.Data;
        this.AnswerChoices.length = 0;
        break;

      case SynchronisationType.CategorySelected:
        this.wheelStateService.SelectedCategory = syncContainer.Data;
        break;

      case SynchronisationType.Players:
        this.gameState.Players.length = 0;
        this.gameState.Players.push(...syncContainer.Data);
        break;

      case SynchronisationType.SolvePhrase:
        let correct = this.wheelStateService.CurrentPhrase.toLowerCase() == syncContainer.Data.toLowerCase();
        let solved = correct ? "solved" : "failed to solve";

        this.snackBar.open(`${this.CurrentPlayer?.Name} has ${solved} the phrase`, "Close", {
          duration: 1500
        });
        break;

      default:
        break;
    }
  }

  private handleInformationShared(infoContainer: InformationContainer): void {
    switch (infoContainer.InformationType) {
      case InformationType.LetterChoice:
        this.handleLetterChoice(infoContainer);
        break;

      case InformationType.SolvePhrase:
        this.handlePhraseSolved(infoContainer);
        break;

      default:
        break;
    }
  }

  private handleLetterChoice(infoContainer: InformationContainer): void {
    if (this.CurrentPhrase.includes(infoContainer.Data)) {
      this.CurrentPlayer!.Score++;
    }

    this.AnswerChoices.push(infoContainer.Data);
    this.socketService.SynchroniseLobby({
      SynchronisationType: SynchronisationType.AnswerChoices,
      Data: this.AnswerChoices
    });

    this.socketService.SynchroniseLobby({
      SynchronisationType: SynchronisationType.Players,
      Data: this.gameState.Players
    });

    this.selectPlayerForTurn();
  }

  private handlePhraseReceived(phrase: string): void {
    this.wheelStateService.CurrentPhrase = phrase.toLowerCase();
    this.AnswerChoices.length = 0;

    this.socketService.SynchroniseLobby({
      SynchronisationType: SynchronisationType.NewPhrase,
      Data: this.wheelStateService.CurrentPhrase
    });
  }

  private handlePhraseSolved(infoContainer: InformationContainer): void {
    this.socketService.SynchroniseLobby({
      SynchronisationType: SynchronisationType.SolvePhrase,
      Data: infoContainer.Data
    });
  }

  private selectPlayerForTurn(): void {
    if (this.currentPlayerIndex >= this.gameState.Players.length) {
      Utils.Shuffle(this.gameState.Players);
      this.currentPlayerIndex = 0;
    }

    let player = this.gameState.Players.at(this.currentPlayerIndex);
    this.currentPlayerIndex++;

    this.wheelStateService.SelectedPlayer = player!;

    this.socketService.SynchroniseLobby({
      SynchronisationType: SynchronisationType.PlayerTurn,
      Data: player
    });
  }

  private getRandomEnum<T>(anEnum: T): Observable<T[keyof T]> {
    const enumValues = Object.keys(anEnum)
      .map(n => Number.parseInt(n))
      .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    const randomEnumValue = enumValues[randomIndex]
    return of(randomEnumValue).pipe(delay(2000));;
  }
}
