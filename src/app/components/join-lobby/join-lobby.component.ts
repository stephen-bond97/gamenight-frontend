import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { TriviaStateService } from 'src/app/services/trivia-state.service';

@Component({
  selector: 'app-join-lobby',
  templateUrl: './join-lobby.component.html',
  styleUrls: ['./join-lobby.component.scss']
})
export class JoinLobbyComponent implements OnInit {
  public LobbyCode = "";
  public LobbyState = "";


  constructor(
    private activatedRoute: ActivatedRoute, 
    private socketService: SocketService, 
    private triviaStateService: TriviaStateService,
    private router: Router,
    private route: ActivatedRoute) { 
    this.socketService.LobbyJoined.subscribe(() => this.handleLobbyJoined());
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        let lobbyCode = paramMap.get('LobbyCode');
        if (lobbyCode) {
          this.LobbyCode = lobbyCode;
        }
      }
    });
  }

  public HandleJoinLobbyClick(): void {
    this.socketService.JoinLobby(this.LobbyCode);
  }

  private handleLobbyJoined(): void {
    this.triviaStateService.LobbyCode = this.LobbyCode;
    this.router.navigate(["../lobby"], {relativeTo: this.route})
  }

}
