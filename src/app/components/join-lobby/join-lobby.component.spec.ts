import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WrappedSocket } from 'ngx-socket-io/src/socket-io.service';
import { of } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { SocketService } from 'src/app/services/socket.service';
import { AppServiceSpy } from 'src/testing/spies/app.service.spy';
import { SocketServiceSpy } from 'src/testing/spies/socket.service.spy';

import { JoinLobbyComponent } from './join-lobby.component';

describe('JoinLobbyComponent', () => {
  let component: JoinLobbyComponent;
  let fixture: ComponentFixture<JoinLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinLobbyComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: of({LobbyCode: "aaa"})} },
        { provide: SocketService, useClass: SocketServiceSpy },
        { provide: AppService, useClass: AppServiceSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
