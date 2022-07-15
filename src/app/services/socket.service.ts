import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';

enum Request {
  CreateLobby = 'create-lobby',
  JoinLobby = 'join-lobby',
  ShareInformation = 'share-information',
  SynchroniseLobby = 'synchronise-lobby'
}

enum Response {
  LobbyCreated = 'lobby-created',
  LobbyClosed = 'lobby-closed',
  LobbyJoined = 'lobby-joined',
  InformationShared = 'information-shared',
  LobbySynchronised = 'lobby-synchronised'
}

@Injectable()
export class SocketService {
  public LobbyCreated = new Subject<string>();
  public LobbyJoined = new Subject<void>();
  public InformationShared = new Subject<string>();
  public LobbySynchronised = new Subject<string>();
  public LobbyClosed = new Subject<void>();

  public LobbyCode = "";

  public constructor(private socket: Socket) {
    this.socket.on(Response.LobbyCreated, (lobbyCode: string) => this.handleLobbyCreateResponse(lobbyCode));
    this.socket.on(Response.LobbyJoined, () => this.handleLobbyJoinResponse());
    this.socket.on(Response.LobbySynchronised, (data: string) => this.handleLobbySyncResponse(data));
    this.socket.on(Response.InformationShared, (data: string) => this.handleInformationSharedResponse(data))
    this.socket.on(Response.LobbyClosed, () => this.handleLobbyCloseResponse());
  }

  //#region socket event handlers

  private handleLobbyCreateResponse(lobbyCode: string): void {
    this.LobbyCode = lobbyCode;
    this.LobbyCreated.next(lobbyCode);
  }

  private handleLobbyJoinResponse(): void {
    this.LobbyJoined.next();
  }

  private handleInformationSharedResponse(data: string) {
    this.InformationShared.next(data);
  }

  private handleLobbySyncResponse(data: string): void {
    this.LobbySynchronised.next(data);
  }

  private handleLobbyCloseResponse(): void {
    this.LobbyClosed.next();
  }

  //#endregion

  //#region public methods

  public CreateLobby(): void {
    this.socket.emit(Request.CreateLobby);
  }

  public JoinLobby(lobbyCode: string): void {
    this.socket.emit(Request.JoinLobby, lobbyCode);
  }

  public ShareInformation(data: string): void {
    this.socket.emit(Request.ShareInformation, data);
  }

  public SynchroniseLobby(data: string): void {
    this.socket.emit(Request.SynchroniseLobby, data);
  }

  //#endregion
}
