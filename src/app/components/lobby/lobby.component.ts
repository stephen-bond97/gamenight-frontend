import { Component, OnInit } from '@angular/core';
import { TriviaStateService } from 'src/app/services/trivia-state.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  public LobbyCode = "";

  constructor(private triviaState: TriviaStateService) { }

  ngOnInit(): void {
    this.LobbyCode = this.triviaState.LobbyCode;
  }

}
