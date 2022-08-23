import { Component, OnInit } from '@angular/core';
import { GameStateService } from 'src/app/services/game-state.service';
import { TriviaStateService } from 'src/app/services/trivia-state.service';
import { WheelOfFortuneStateService } from 'src/app/services/wheel-of-fortune.state.service';
import { PlayerInfo } from 'src/typings/playerInfo';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  public get Players(): PlayerInfo[] {
    return this.gameState.Players;
  }

  public get CurrentPlayer(): PlayerInfo | null {
    return this.wheelStateService.SelectedPlayer;
  }


  constructor(
    private gameState: GameStateService,
    private wheelStateService: WheelOfFortuneStateService
  ) { }

  ngOnInit(): void {
  }

  
}
