import { Component, OnInit } from '@angular/core';
import { TriviaStateService } from 'src/app/services/trivia-state.service';
import { PlayerInfo } from 'src/typings/playerInfo';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  public get Players(): PlayerInfo[] {
    return this.triviaState.Players;
  }


  constructor(
    private triviaState: TriviaStateService
  ) { }

  ngOnInit(): void {
  }

  
}
