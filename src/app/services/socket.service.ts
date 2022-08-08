import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { InformationContainer } from 'src/typings/informationContainer';
import { InformationType } from 'src/typings/informationType.enum';

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
  public InformationShared = new Subject<InformationContainer>();
  public LobbySynchronised = new Subject<string>();
  public LobbyClosed = new Subject<void>();

  public LobbyCode = "";
  private isHost = false;
  public get IsHost(): boolean { return this.isHost; }

  public constructor(private socket: Socket) {
    this.socket.on(Response.LobbyCreated, (lobbyCode: string) => this.handleLobbyCreateResponse(lobbyCode));
    this.socket.on(Response.LobbyJoined, () => this.handleLobbyJoinResponse());
    this.socket.on(Response.LobbySynchronised, (data: string) => this.handleLobbySyncResponse(data));
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

  public ShareInformation(data: InformationContainer): void {
    let dataString = JSON.stringify(data);
    this.socket.emit(Request.ShareInformation, dataString);
  }

  public SynchroniseLobby(data: string): void {
    this.socket.emit(Request.SynchroniseLobby, data);
  }

  public SetHost(): void {
    this.isHost = true;

    this.socket.on(Response.InformationShared, (data: string) => {
      let informationContainer: InformationContainer = JSON.parse(data);
      this.InformationShared.next(informationContainer);
    });
  }

  //#endregion
}
