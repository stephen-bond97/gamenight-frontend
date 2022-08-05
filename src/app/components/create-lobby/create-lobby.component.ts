import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { SocketService } from 'src/app/services/socket.service';
import { TriviaStateService } from 'src/app/services/trivia-state.service';
import { TriviaService } from 'src/app/services/trivia.service';
import { Category, Category2LabelMapping } from 'src/typings/category.enum';

@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.scss']
})
export class CreateLobbyComponent implements OnInit {
  public LobbyCode = "";
  public numberOfRounds = 0;
  public selectedCategory = "";
  public Category2LabelMapping = Category2LabelMapping;

  public constructor(
    private trivia: TriviaService, 
    private socketService: SocketService, 
    private appService: AppService,
    private triviaStateService: TriviaStateService,
    private router: Router,
    private route: ActivatedRoute) {
    this.socketService.LobbyCreated.subscribe((lobbyCode) => this.handleLobbyCreated(lobbyCode));
  }

  public categories = Object.values(Category);

  ngOnInit(): void {
    // this.trivia.GetQuestions(this.selectedCategory)
    // .subscribe((data: any) => console.log(data));
  }

  public HandleCreateLobbyClick(): void {
    this.appService.SetLoading(true);
    this.socketService.CreateLobby();
  }

  private handleLobbyCreated(lobbyCode: string): void {
    this.LobbyCode = lobbyCode;
    this.appService.SetLoading(false);
    this.triviaStateService.LobbyCode = lobbyCode;
    this.router.navigate(["../lobby"], { relativeTo: this.route });
  }
}
