import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of, delay, timeout } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { GameStateService } from 'src/app/services/game-state.service';
import { PhraseService } from 'src/app/services/phrase.service';
import { SocketService } from 'src/app/services/socket.service';
import { WheelOfFortuneStateService } from 'src/app/services/wheel-of-fortune.state.service';
import { GameInformation } from 'src/typings/gameInformation';
import { InformationContainer } from 'src/typings/informationContainer';
import { InformationType } from 'src/typings/informationType.enum';
import { PhraseCategory } from 'src/typings/phraseCategory.enum';
import { PlayerInfo } from 'src/typings/playerInfo';
import { SynchronisationType } from 'src/typings/synchronisationType.enum';
import { SynchroniseContainer } from 'src/typings/synchroniseContainer';
import { Utils } from 'src/utils';
import { SolvePhraseComponent } from './solve-phrase/solve-phrase.component';

@UntilDestroy()
@Component({
  selector: 'app-wheel-of-fortune-game',
  templateUrl: './wheel-of-fortune-game.component.html',
  styleUrls: ['./wheel-of-fortune-game.component.scss']
})
export class WheelOfFortuneComponent implements OnInit, OnDestroy {
  private readonly PHRASES_PER_ROUND = 3;
  private phrasesCompleted = 0;
  private currentPlayerIndex = 0;

  public AnswerChoices: string[] = [];

  public LetterChoice = "";

  public get CurrentPhrase(): string[] {
    return this.wheelStateService.CurrentPhrase.toLowerCase().split("");
  }

  public get CurrentPlayer(): PlayerInfo | null {
    return this.wheelStateService.SelectedPlayer;
  }

  public get IsCurrentPlayer(): boolean {
    return this.CurrentPlayer?.Name == this.appService.PlayerInfo?.Name;
  }

  public get Winner(): PlayerInfo | null {
    let sortedArray = [...this.gameState.Players]
      .sort((a, b) => a.Score - b.Score)
      .reverse();
    
    return sortedArray.at(0)!;
  }

  public get SelectedCategory(): PhraseCategory | null {
    return this.wheelStateService.SelectedCategory;
  }

  public get NumberOfRounds(): number {
    return this.gameState.NumberOfRounds;
  }

  public get FilteredChoices(): string[] {
    return this.AnswerChoices.filter((s) => !this.CurrentPhrase.includes(s));
  }

  public get ShowSolveButton(): boolean {
    let moreThanHalf = this.AnswerChoices.length < (this.CurrentPhrase.length / 1.25);
    let choicesRemaining = this.CurrentPhrase.length - (this.CurrentPhrase.filter((s) => this.AnswerChoices.includes(s) || s == " ").length);
    
    return choicesRemaining > 5 && moreThanHalf;
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

    //#region angular life cycle hooks

  ngOnInit(): void {
    if (!this.socketService.IsHost) {
      this.socketService.LobbySynchronised
        .pipe(untilDestroyed(this))
        .subscribe((syncContainer) => this.handleLobbySynchronised(syncContainer));
    }
    else {
      this.socketService.InformationShared
        .pipe(untilDestroyed(this))
        .subscribe((infoContainer) => this.handleInformationShared(infoContainer));

      this.socketService.SynchroniseLobby({
        SynchronisationType: SynchronisationType.GameStarted
      });

      this.getRandomCategory();
      Utils.Shuffle(this.gameState.Players);
      setTimeout(() => {
        this.selectPlayerForTurn();
      }, 2000);
    }
  }

  ngOnDestroy(): void {
    if (this.socketService.IsHost) {
      this.socketService.CloseLobby();
    }

      this.wheelStateService.SelectedCategory = null;
      this.RoundsCompleted = 0;
      this.gameState.NumberOfRounds = 0;
      this.wheelStateService.CurrentPhrase = "";
      this.wheelStateService.SelectedPlayer = null;
      this.phrasesCompleted = 0;
      this.currentPlayerIndex = 0;
      this.LetterChoice = "";
      this.AnswerChoices = [];
      this.appService.PlayerInfo!.Score = 0;
  }

  //#endregion

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

      if (this.CurrentPhrase.includes(this.LetterChoice.toLowerCase())) {
        let count = this.CurrentPhrase.filter((s) => s == this.LetterChoice.toLowerCase()).length;
        this.CurrentPlayer!.Score += count;
      }      

      this.socketService.SynchroniseLobby({
        SynchronisationType: SynchronisationType.Players,
        Data: this.gameState.Players
      });

      this.checkGameEnd();
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
    this.dialog
      .open(SolvePhraseComponent, {
        enterAnimationDuration: "500ms",
        exitAnimationDuration: "100ms",
        disableClose: true
      })
      .afterClosed()
        .pipe(untilDestroyed(this))
        .subscribe((phraseChoice) => {
          if (!phraseChoice) {
            return;  
          }

          if (!this.socketService.IsHost) {
            this.socketService.ShareInformation({
              InformationType: InformationType.SolvePhrase,
              Data: phraseChoice
            });
          }
          else {
            this.handlePhraseSolved(phraseChoice);
          }
        });
  }

  private getRandomCategory(): void {
    this.wheelStateService.SelectedCategory = null;

    this.getRandomEnum(PhraseCategory)
      .pipe(untilDestroyed(this))
      .subscribe((r) => {
        this.wheelStateService.SelectedCategory = r;

        this.socketService.SynchroniseLobby({
          SynchronisationType: SynchronisationType.CategorySelected,
          Data: this.wheelStateService.SelectedCategory
        });

        this.phraseService.GetPhrase(this.wheelStateService.SelectedCategory)
          .pipe(untilDestroyed(this))
          .subscribe((phrase) => this.handlePhraseReceived(phrase));
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
        this.showSolveStatus(syncContainer.Data);
        break;

      case SynchronisationType.GameInformation:
        this.gameState.NumberOfRounds = syncContainer.Data.NumberOfRounds;
        this.RoundsCompleted = syncContainer.Data.RoundsCompleted;
        break;

      default:
        break;
    }
  }

  private showSolveStatus(answer: string): void {
    let correct = this.wheelStateService.CurrentPhrase.toLowerCase() == answer.toLowerCase();
    let solved = correct ? "solved" : "failed to solve";

    let playerName = this.CurrentPlayer?.Name;
    this.snackBar.open(`${playerName} has ${solved} the phrase`, "Close", {
      duration: 2000
    });

    this.wheelStateService.SelectedPlayer = null;

    if (this.socketService.IsHost) {

      if (correct) {
        // show players the correct answer after someone has solved
        // wait a few seconds before getting the next phrase
        setTimeout(() => {
          this.progressGameState();
        }, 3000);
      }
      else {
        this.selectPlayerForTurn();
      }
    }

    if (correct) {
      this.AnswerChoices.length = 0;
      this.AnswerChoices.push(...this.CurrentPhrase);
    }
  }

  private handleInformationShared(infoContainer: InformationContainer): void {

    switch (infoContainer.InformationType) {
      case InformationType.LetterChoice:
        this.handleLetterChoice(infoContainer);
        break;

      case InformationType.SolvePhrase:
        this.handlePhraseSolved(infoContainer.Data);
        break;

      default:
        break;
    }
  }

  private handleLetterChoice(infoContainer: InformationContainer): void {
    if (this.CurrentPhrase.includes(infoContainer.Data)) {
      let count = this.CurrentPhrase.filter((s) => s == infoContainer.Data).length;
      this.CurrentPlayer!.Score += count;
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

    // get currentphrase filtered by answer choices
    this.checkGameEnd();
  }

  private checkGameEnd() {
    let lettersLeft = this.CurrentPhrase.filter((s) => !this.AnswerChoices.includes(s) && s != " ");
    if (lettersLeft.length == 0) {
      this.snackBar.open("Phrase has been solved", "Close", {
        duration: 2000
      });

      this.wheelStateService.SelectedPlayer = null;

      setTimeout(() => {
        this.progressGameState();
      }, 2000);
      
      return;
    }

    this.selectPlayerForTurn();
  }

  private handlePhraseReceived(phrase: string): void {
    this.wheelStateService.CurrentPhrase = phrase.toLowerCase();
    this.phrasesCompleted++;
    this.AnswerChoices.length = 0;

    this.socketService.SynchroniseLobby({
      SynchronisationType: SynchronisationType.NewPhrase,
      Data: this.wheelStateService.CurrentPhrase
    });

    this.synchroniseGameInformation();
  }

  private handlePhraseSolved(phrase: string): void {
    if (this.wheelStateService.CurrentPhrase.toLowerCase() == phrase.toLowerCase()) {
      this.CurrentPlayer!.Score += 5;

      this.socketService.SynchroniseLobby({
        SynchronisationType: SynchronisationType.Players,
        Data: this.gameState.Players
      });

      this.AnswerChoices.length = 0;
      this.AnswerChoices.push(...this.CurrentPhrase);
    }

    this.socketService.SynchroniseLobby({
      SynchronisationType: SynchronisationType.SolvePhrase,
      Data: phrase
    });

    this.showSolveStatus(phrase);
  }

  private selectPlayerForTurn(): void {
    if (this.currentPlayerIndex >= this.gameState.Players.length) {
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

  public progressGameState() {
    this.selectPlayerForTurn();

    if (this.phrasesCompleted < this.PHRASES_PER_ROUND) {
      this.phraseService
        .GetPhrase(this.wheelStateService.SelectedCategory!)
        .pipe(untilDestroyed(this))
        .subscribe((phrase) => this.handlePhraseReceived(phrase));
      return;
    }

    this.RoundsCompleted++;

    if (this.RoundsCompleted >= this.NumberOfRounds) {
      this.synchroniseGameInformation();
      return;
    }

    this.phrasesCompleted = 0;
    this.getRandomCategory();
  }

  private synchroniseGameInformation() {
    this.socketService.SynchroniseLobby<GameInformation>({
      SynchronisationType: SynchronisationType.GameInformation,
      Data: {
        NumberOfRounds: this.gameState.NumberOfRounds,
        RoundsCompleted: this.RoundsCompleted,
        SelectedCategory: this.wheelStateService.SelectedCategory
      }
    });
  }

  private getRandomEnum<T>(anEnum: T): Observable<T[keyof T]> {
    const enumValues = Object.keys(anEnum)
      .map(n => Number.parseInt(n))
      .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    const randomEnumValue = enumValues[randomIndex]
    return of(randomEnumValue).pipe(delay(2000));
  }
}
