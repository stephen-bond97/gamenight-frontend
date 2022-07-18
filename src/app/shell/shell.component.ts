import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  public LobbyCode = "";
  public Message = "";
  public Reply = "";
  public LobbyState = "Not created";
  public ShowFullscreen = true;

  public constructor(private socketService: SocketService) {
    this.socketService.LobbyCreated.subscribe((lobbyCode) => this.handleLobbyCreated(lobbyCode));
    this.socketService.LobbyJoined.subscribe(() => this.handleLobbyJoined());
    this.socketService.LobbyClosed.subscribe(() => this.handleLobbyClosed());
    this.socketService.InformationShared.subscribe((data) => this.handleInformationShared(data));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.ShowFullscreen = false;
    }, 3000);
  }

  public HandleCreateLobbyClick(): void {
    this.socketService.CreateLobby();
  }

  public HandleJoinLobbyClick(): void {
    this.socketService.JoinLobby(this.LobbyCode);
  }

  public HandleSendMessageClick(): void {
    this.socketService.ShareInformation(this.Message);
  }

  private handleLobbyCreated(lobbyCode: string): void {
    this.LobbyCode = lobbyCode;
    this.LobbyState = "Lobby Created";
  }

  private handleLobbyJoined(): void {
    this.LobbyState = "Lobby joined";
  }

  private handleLobbyClosed(): void {
    this.LobbyState = "Lobby closed";
  }

  private handleInformationShared(data: string): void {
    this.Reply = data;
  }
}
