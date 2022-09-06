import { Subject } from "rxjs";
import { InformationContainer } from "src/typings/informationContainer";
import { SynchroniseContainer } from "src/typings/synchroniseContainer";

export class SocketServiceSpy {
    LobbyCode = "testlobby123";
    IsHost = true;
    InformationShared = new Subject<InformationContainer>();
    LobbySynchronised = new Subject<SynchroniseContainer<any>>();
    Exception = new Subject<string>();
    LobbyCreated = new Subject<string>();
    LobbyJoined = new Subject<void>();
    CreateLobby = jasmine.createSpy("CreateLobby") as any;
    SetHost = jasmine.createSpy("SetHost") as any;
    SynchroniseLobby = jasmine.createSpy("SynchroniseLobby") as any;
  }