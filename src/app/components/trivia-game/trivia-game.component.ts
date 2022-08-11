import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { TriviaStateService } from 'src/app/services/trivia-state.service';
import { TriviaService } from 'src/app/services/trivia.service';
import { Category } from 'src/typings/category.enum';
import { InformationType } from 'src/typings/informationType.enum';
import { SynchronisationType } from 'src/typings/synchronisationType.enum';
import { SynchroniseContainer } from 'src/typings/synchroniseContainer';
import { TriviaQuestion } from 'src/typings/triviaQuestion';

@Component({
  selector: 'app-trivia-game',
  templateUrl: './trivia-game.component.html',
  styleUrls: ['./trivia-game.component.scss']
})
export class TriviaGameComponent implements OnInit {

  public get CurrentQuestion(): TriviaQuestion | null {
    return this.triviaState.CurrentQuestion;
  }

  public constructor(
    private triviaService: TriviaService, 
    private socketService: SocketService, 
    private triviaState: TriviaStateService) { }

  ngOnInit(): void {
    if (this.socketService.IsHost) {
      // go get question
      this.triviaService.GetQuestions(Category.animals).subscribe((question) => this.handleQuestionReceived(question));
      // handle question recieved
      
      // send out synchronise event with type game started and data is the question
    }
  }

  // public get Questions(): TriviaQuestion {
  //   return this.triviaService.GetQuestions()
  // }

  private handleQuestionReceived(question: TriviaQuestion): void {
    this.triviaState.CurrentQuestion = question;

    let syncContainer: SynchroniseContainer = {
      SynchronisationType: SynchronisationType.GameStarted,
      Data: question
    }
    this.socketService.SynchroniseLobby(syncContainer);
  }

}
