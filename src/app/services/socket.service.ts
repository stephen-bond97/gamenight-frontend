import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { InformationContainer } from 'src/typings/informationContainer';
import { SynchroniseContainer } from 'src/typings/synchroniseContainer';

enum Request {
  CreateLobby = 'create-lobby',
  JoinLobby = 'join-lobby',
  ShareInformation = 'share-information',
  SynchroniseLobby = 'synchronise-lobby',
  CloseLobby = 'close-lobby'
}

enum Response {
  LobbyCreated = 'lobby-created',
  LobbyClosed = 'lobby-closed',
  LobbyJoined = 'lobby-joined',
  InformationShared = 'information-shared',
  LobbySynchronised = 'lobby-synchronised',
  Exception = 'exception'
}

@Injectable()
export class SocketService {
  public LobbyCreated = new Subject<string>();
  public LobbyJoined = new Subject<void>();
  public InformationShared = new Subject<InformationContainer>();
  public LobbySynchronised = new Subject<SynchroniseContainer<any>>();
  public LobbyClosed = new Subject<void>();
  public Exception = new Subject<string>();

  public LobbyCode = "";
  private isHost = false;
  public get IsHost(): boolean { return this.isHost; }

  public constructor(private socket: Socket) {
    this.socket.on(Response.LobbyCreated, (lobbyCode: string) => this.handleLobbyCreateResponse(lobbyCode));
    this.socket.on(Response.LobbyJoined, () => this.handleLobbyJoinResponse());
    this.socket.on(Response.LobbySynchronised, (data: string) => this.handleLobbySyncResponse(data));
    this.socket.on(Response.LobbyClosed, () => this.handleLobbyCloseResponse());
    this.socket.on(Response.Exception, (data: string) => this.handleExceptionResponse(data));
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
    let syncContainer: SynchroniseContainer<any> = JSON.parse(data);
    this.LobbySynchronised.next(syncContainer);
  }

  private handleLobbyCloseResponse(): void {
    this.LobbyClosed.next();
  }

  private handleExceptionResponse(data: string): void {
    this.Exception.next(data);
  }

  //#endregion

  //#region public methods

  public CreateLobby(): void {
    this.socket.emit(Request.CreateLobby);
  }

  public CloseLobby(): void {
    this.socket.emit(Request.CloseLobby, this.LobbyCode);
  }

  public JoinLobby(lobbyCode: string): void {
    this.socket.emit(Request.JoinLobby, lobbyCode);
  }

  public ShareInformation(data: InformationContainer): void {
    let dataString = JSON.stringify(data);
    this.socket.emit(Request.ShareInformation, dataString);
  }

  public SynchroniseLobby<T>(data: SynchroniseContainer<T>): void {
    let dataString = JSON.stringify(data);
    this.socket.emit(Request.SynchroniseLobby, dataString);
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
