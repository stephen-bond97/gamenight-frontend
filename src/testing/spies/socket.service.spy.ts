import { Subject } from "rxjs";
import { InformationContainer } from "src/typings/informationContainer";

export class SocketServiceSpy {
    LobbyCode = "testlobby123";
    IsHost = true;
    InformationShared = new Subject<InformationContainer>();
    LobbyCreated = new Subject<string>();
    CreateLobby = jasmine.createSpy("CreateLobby");
    SetHost = jasmine.createSpy("SetHost");
  }