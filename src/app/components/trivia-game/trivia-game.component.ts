import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { TriviaStateService } from 'src/app/services/trivia-state.service';
import { TriviaService } from 'src/app/services/trivia.service';
import { AppService } from 'src/app/services/app.service';
import { InformationContainer } from 'src/typings/informationContainer';
import { InformationType } from 'src/typings/informationType.enum';
import { SynchronisationType } from 'src/typings/synchronisationType.enum';
import { SynchroniseContainer } from 'src/typings/synchroniseContainer';
import { TriviaAnswerChoice } from 'src/typings/triviaAnswerChoice';
import { TriviaQuestion } from 'src/typings/triviaQuestion';
import { GameInformation } from 'src/typings/gameInformation';
import { Category, Category2LabelMapping } from 'src/typings/category.enum';
import { PlayerInfo } from 'src/typings/playerInfo';

@Component({
  selector: 'app-trivia-game',
  templateUrl: './trivia-game.component.html',
  styleUrls: ['./trivia-game.component.scss']
})
export class TriviaGameComponent implements OnInit {

  private readonly TIME_FOR_QUESTION = 10;
  private readonly QUESTIONS_PER_ROUND = 5;

  public get CurrentQuestion(): TriviaQuestion | null {
    return this.triviaState.CurrentQuestion;
  }

  public get TimeRemaining(): number {
    return (this.timer / this.TIME_FOR_QUESTION) * 100;
  }

  public get NumberOfRounds(): number {
    return this.triviaState.NumberOfRounds;
  }

  public Answers: string[] = [];
  public AnswerSelected = false;

  public ShowCategorySelector = false;
  public RoundsCompleted = 0;

  private timer = this.TIME_FOR_QUESTION;
  private questionsCompleted = 0;

  private playerChoices: TriviaAnswerChoice[] = [];

  public constructor(
    private triviaService: TriviaService,
    private socketService: SocketService,
    private triviaState: TriviaStateService,
    private appService: AppService) { }

  ngOnInit(): void {
    if (this.socketService.IsHost) {
      this.socketService.InformationShared.subscribe((infoContainer) => this.handleInformationShared(infoContainer));
      this.ShowCategorySelector = true;
    }
    else {
      this.reset();
      this.socketService.LobbySynchronised.subscribe((syncContainer) => this.handleSynchronisation(syncContainer));
    }
  }

  public GetPlayerAnswerChoices(answer: string): TriviaAnswerChoice[] {
    if (!this.AnswerSelected) {
      return [];
    }

    return this.playerChoices
      .filter(c => c.Answer == answer);
  }

  public HandleCategorySelected(): void {
    if (this.socketService.IsHost) {
      this.getNewQuestion();
    }

    this.ShowCategorySelector = false;
  }

  public HandleAnswerSelected(answer: string): void {
    let triviaAnswerChoice: TriviaAnswerChoice = {
      PlayerInfo: this.appService.PlayerInfo!,
      Answer: answer
    };

    if (!this.socketService.IsHost) {
      this.socketService.ShareInformation({
        InformationType: InformationType.TriviaAnswerChoice,
        Data: triviaAnswerChoice
      });
    }
    else {
      this.verifyAnswer(triviaAnswerChoice);

      this.socketService.SynchroniseLobby({
        SynchronisationType: SynchronisationType.TriviaAnswerChoices,
        Data: this.playerChoices
      });
    }

    this.AnswerSelected = true;
  }

  private getNewQuestion(): void {
    this.triviaService
      .GetQuestions(this.triviaState.SelectedCategory)
      .subscribe((question) => this.handleQuestionReceived(question));
  }

  private reset(): void {
    this.shuffleAnswers();
    this.beginTimer();

    this.AnswerSelected = false;
    this.playerChoices.length = 0;
  }

  private beginTimer(): void {
    this.timer = this.TIME_FOR_QUESTION;

    let interval = setInterval(() => {
      this.timer--;

      if (this.timer <= 0) {
        clearInterval(interval);
        this.handleTimerEnd();
      }
    }, 1000);
  }

  private handleTimerEnd() {
    // when question timer finishes, host should update all player scores
    if (this.socketService.IsHost) {
      this.synchronisePlayers();

      // wait 5 seconds then get a new question
      setTimeout(() => {
        this.progressGameState();
      }, 5000);
    }

    // if timer has ended and no choice is made, we pick an empty answer
    if (!this.AnswerSelected) {
      this.HandleAnswerSelected("");
    }
  }

  private progressGameState() {
    if (this.questionsCompleted < this.QUESTIONS_PER_ROUND) {
      this.getNewQuestion();
      return;
    }

    this.RoundsCompleted++;

    if (this.RoundsCompleted >= this.NumberOfRounds) {
      this.synchroniseGameInformation();
      return;
    }

    this.questionsCompleted = 0;
    this.ShowCategorySelector = true;
  }

  // private gameEnd()

  private handleQuestionReceived(question: TriviaQuestion): void {
    this.triviaState.CurrentQuestion = question;
    this.questionsCompleted++;

    // set default for sync type to be game started, will be overridden after game has begun
    let syncType = SynchronisationType.GameStarted;
    if (this.playerChoices.length > 0) {
      syncType = SynchronisationType.NewQuestion;
    }

    this.reset();

    // synchronise the new question with the rest of the lobby
    this.socketService.SynchroniseLobby({
      SynchronisationType: syncType,
      Data: question
    });

    // synchronise player scores and information with the lobby
    this.synchroniseGameInformation();
  }

  private synchroniseGameInformation() {
    this.socketService.SynchroniseLobby<GameInformation>({
      SynchronisationType: SynchronisationType.GameInformation,
      Data: {
        NumberOfRounds: this.triviaState.NumberOfRounds,
        RoundsCompleted: this.RoundsCompleted,
        SelectedCategory: this.triviaState.SelectedCategory
      }
    });
  }

  private synchronisePlayers(): void {
    this.socketService.SynchroniseLobby({
      SynchronisationType: SynchronisationType.Players,
      Data: this.triviaState.Players
    });
  }

  private handleInformationShared(infoContainer: InformationContainer): void {

    switch (infoContainer.InformationType) {
      case InformationType.TriviaAnswerChoice:
        this.verifyAnswer(infoContainer.Data);

        this.socketService.SynchroniseLobby({
          SynchronisationType: SynchronisationType.TriviaAnswerChoices,
          Data: this.playerChoices
        });
        break;

      default:
        break;
    }
  }

  private verifyAnswer(triviaAnswerChoice: TriviaAnswerChoice) {
    this.playerChoices.push(triviaAnswerChoice);

    // todo use playerId instead of name
    if (triviaAnswerChoice.Answer == this.CurrentQuestion?.correct_answer) {
      let player = this.triviaState.Players.find(p => p.Name == triviaAnswerChoice.PlayerInfo.Name);
      player!.Score++;
    }
  }

  /**
   * Players handlng the host synchronisation event
   * @param syncContainer 
   */
  private handleSynchronisation(syncContainer: SynchroniseContainer<any>): void {
    switch (syncContainer.SynchronisationType) {
      case SynchronisationType.TriviaAnswerChoices:
        this.playerChoices.length = 0;
        this.playerChoices.push(...syncContainer.Data);
        break;

      case SynchronisationType.Players:
        this.triviaState.Players.length = 0;
        this.triviaState.Players.push(...syncContainer.Data);
        console.log(syncContainer);
        break;

      case SynchronisationType.NewQuestion:
        this.triviaState.CurrentQuestion = syncContainer.Data;
        this.reset();
        break;

      case SynchronisationType.GameInformation:
        this.triviaState.NumberOfRounds = syncContainer.Data.NumberOfRounds;
        this.RoundsCompleted = syncContainer.Data.RoundsCompleted;
        this.triviaState.SelectedCategory = syncContainer.Data.SelectedCategory;
        break;

      default:
        break;
    }
  }

  private shuffleAnswers(): void {
    if (!this.CurrentQuestion)
      return;

    let allAnswers = [...this.CurrentQuestion.incorrect_answers, this.CurrentQuestion.correct_answer];
    let shuffled = this.shuffle(allAnswers);

    this.Answers.length = 0;
    this.Answers.push(...shuffled);
  }

  // https://stackoverflow.com/questions/48083353/i-want-to-know-how-to-shuffle-an-array-in-typescript
  private shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

}
