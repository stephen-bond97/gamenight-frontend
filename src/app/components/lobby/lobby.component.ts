import { Component, OnInit } from '@angular/core';
import { TriviaStateService } from 'src/app/services/trivia-state.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  public LobbyCode = "";
  public ShowLobbyCode = false;

  constructor(private triviaState: TriviaStateService) { }

  ngOnInit(): void {
    this.LobbyCode = this.triviaState.LobbyCode;
    if (this.triviaState.IsHost == true) {
      this.ShowLobbyCode = true;
    }
  }

  public copyToClipboard(input: HTMLInputElement, event: MouseEvent): void {
    event.stopPropagation();

    input.select();
    document.execCommand('copy');
    input.setSelectionRange(0, 0);
  }

}
