import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { GameStateService } from 'src/app/services/game-state.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SocketService } from 'src/app/services/socket.service';
import { Category, Category2LabelMapping } from 'src/typings/category.enum';

@UntilDestroy()
@Component({
  selector: 'app-create-lobby',
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.scss']
})
export class CreateLobbyComponent implements OnInit {
  public numberOfRounds = 1;
  public selectedCategory = "";
  public Category2LabelMapping = Category2LabelMapping;

  public constructor(
    private gameState: GameStateService,
    private socketService: SocketService, 
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute) {
    this.socketService.LobbyCreated
    .pipe(untilDestroyed(this))
    .subscribe((lobbyCode) => this.handleLobbyCreated(lobbyCode));
  }

  public categories = Object.values(Category);

  ngOnInit(): void {
    this.gameState.Players.length = 0;
    this.gameState.NumberOfRounds = 1;
    this.gameState.GameStarted = false;
  }

  public HandleCreateLobbyClick(): void {
    this.appService.SetLoading(true);
    this.socketService.CreateLobby();
  }

  private handleLobbyCreated(lobbyCode: string): void {
    this.appService.SetLoading(false);
    this.socketService.LobbyCode = lobbyCode;
    this.gameState.NumberOfRounds = this.numberOfRounds;
    this.socketService.SetHost();
    this.router.navigate(["../lobby"], { relativeTo: this.route });
  }
}
