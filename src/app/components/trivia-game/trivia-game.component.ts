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
import { Category, Category2LabelMapping } from 'src/typings/category.enum';
import { PlayerInfo } from 'src/typings/playerInfo';

@Component({
  selector: 'app-trivia-game',
  templateUrl: './trivia-game.component.html',
  styleUrls: ['./trivia-game.component.scss']
})
export class TriviaGameComponent implements OnInit {

  private readonly TIME_FOR_QUESTION = 10;

  public get CurrentQuestion(): TriviaQuestion | null {
    return this.triviaState.CurrentQuestion;
  }

  public get TimeRemaining(): number {
    return (this.timer / this.TIME_FOR_QUESTION) * 100;
  }

  public get Players(): PlayerInfo[] {
    return this.triviaState.Players;
  }

  public Answers: string[] = [];
  public PlayerChoices: TriviaAnswerChoice[] = [];
  public AnswerSelected = false;

  public SelectedCategory = "";
  public Category2LabelMapping = Category2LabelMapping;
  public Categories = Object.values(Category);
  public ShowCategorySelector = false;

  private timer = this.TIME_FOR_QUESTION;

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

  public CheckAnswer(answer: string): boolean {
    if (this.AnswerSelected &&
      this.TimeRemaining <= 0 &&
      this.CurrentQuestion?.correct_answer == answer) {
      return true
    }

    return false;
  }

  public GetPlayerSelections(answer: string): TriviaAnswerChoice[] {
    if (!this.AnswerSelected) {
      return [];
    }

    return this.PlayerChoices
      .filter(c => c.Answer == answer);
  }

  public HandleCategorySelected(): void {
    if (this.socketService.IsHost) {
      this.getNewQuestion();
    }

    this.ShowCategorySelector = false;
  }

  public HandleSelectedAnswer(answer: string): void {
    if (!this.socketService.IsHost) {
      let triviaAnswerChoice: TriviaAnswerChoice = {
        PlayerInfo: this.appService.PlayerInfo!,
        Answer: answer
      };
      let infoContainer: InformationContainer = {
        InformationType: InformationType.TriviaAnswerChoice,
        Data: triviaAnswerChoice
      };

      this.socketService.ShareInformation(infoContainer);
    }
    else {
      let triviaAnswerChoice: TriviaAnswerChoice = {
        PlayerInfo: this.appService.PlayerInfo!,
        Answer: answer
      };

      this.PlayerChoices.push(triviaAnswerChoice);

      this.VerifyAnswer(triviaAnswerChoice);
    }

    let syncContainer: SynchroniseContainer = {
      SynchronisationType: SynchronisationType.TriviaAnswerChoices,
      Data: this.PlayerChoices
    };

    this.AnswerSelected = true;
    this.socketService.SynchroniseLobby(syncContainer);
  }

  private getNewQuestion(): void {
    this.triviaService.GetQuestions(this.SelectedCategory).subscribe((question) => this.handleQuestionReceived(question));
  }

  private reset(): void {
    this.shuffleAnswers();
    this.beginTimer();

    this.AnswerSelected = false;
    this.PlayerChoices.length = 0;
  }

  private beginTimer(): void {
    this.timer = this.TIME_FOR_QUESTION;

    let interval = setInterval(() => {
      this.timer--;

      if (this.timer <= 0) {
        clearInterval(interval);

        if (this.socketService.IsHost) {
          // wait 5 seconds then get a new question
          setTimeout(() => {
            this.getNewQuestion();
          }, 5000);
        }

        if (!this.AnswerSelected) {
          this.HandleSelectedAnswer("");
        }
      }
    }, 1000);
  }

  private handleQuestionReceived(question: TriviaQuestion): void {
    this.triviaState.CurrentQuestion = question;
    let syncType = SynchronisationType.GameStarted;

    if (this.PlayerChoices.length > 0) {
      syncType = SynchronisationType.NewQuestion;
    }

    this.reset();

    let syncContainer: SynchroniseContainer = {
      SynchronisationType: syncType,
      Data: question
    };
    this.socketService.SynchroniseLobby(syncContainer);
  }

  private handleInformationShared(infoContainer: InformationContainer): void {
    if (infoContainer.InformationType == InformationType.TriviaAnswerChoice) {

      this.VerifyAnswer(infoContainer.Data);

      this.PlayerChoices.push(infoContainer.Data);

      let syncContainer: SynchroniseContainer = {
        SynchronisationType: SynchronisationType.TriviaAnswerChoices,
        Data: this.PlayerChoices
      };

      this.socketService.SynchroniseLobby(syncContainer);
    }
  }

  private VerifyAnswer(triviaAnswerChoice: TriviaAnswerChoice) {
    if (triviaAnswerChoice.Answer == this.CurrentQuestion?.correct_answer) {
      let player = this.triviaState.Players.find(p => p.Name == triviaAnswerChoice.PlayerInfo.Name);
      player!.Score++;
    }
  }

  private handleSynchronisation(syncContainer: SynchroniseContainer): void {
    if (syncContainer.SynchronisationType == SynchronisationType.TriviaAnswerChoices) {
      this.PlayerChoices.length = 0;
      this.PlayerChoices.push(...syncContainer.Data);
    }

    if (syncContainer.SynchronisationType == SynchronisationType.NewQuestion) {
      this.triviaState.CurrentQuestion = syncContainer.Data;
      this.reset();
    }
  }

  private shuffleAnswers(): void {
    if (!this.CurrentQuestion)
      return;

    let question = this.CurrentQuestion;

    let allAnswers = [...question.incorrect_answers, question.correct_answer];
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
