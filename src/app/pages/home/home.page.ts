import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  public LobbyCode = "";
  public LobbyState = "";

  constructor(private socketService: SocketService) {
    this.socketService.LobbyCreated.subscribe((lobbyCode) => this.handleLobbyCreated(lobbyCode));
    this.socketService.LobbyJoined.subscribe(() => this.handleLobbyJoined());
  }

  ngOnInit(): void {
  }

  public HandleCreateLobbyClick(): void {
    this.socketService.CreateLobby();
  }

  public HandleJoinLobbyClick(): void {
    this.socketService.JoinLobby(this.LobbyCode);
  }

  private handleLobbyCreated(lobbyCode: string): void {
    this.LobbyCode = lobbyCode;
    console.log(lobbyCode);
  }
  
  private handleLobbyJoined(): void {
    this.LobbyState = "Lobby joined";
  }

}
