import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { SocketService } from 'src/app/services/socket.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { InformationContainer } from 'src/typings/informationContainer';
import { InformationType } from 'src/typings/informationType.enum';

@UntilDestroy()
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
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService) { 
    this.socketService.LobbyJoined
      .pipe(untilDestroyed(this))
      .subscribe(() => this.handleLobbyJoined());
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (paramMap) => {
        let lobbyCode = paramMap.get('LobbyCode');
        if (lobbyCode) {
          this.LobbyCode = lobbyCode;
        }
      }
    });
  }

  public HandleJoinLobbyClick(): void {
    this.appService.SetLoading(true);    
    this.socketService.JoinLobby(this.LobbyCode.toLowerCase());
  }

  private handleLobbyJoined(): void {
    this.socketService.LobbyCode = this.LobbyCode;

    // creating information container
    let infoContainer: InformationContainer = {
      InformationType: InformationType.PlayerInfo,
      Data: this.appService.PlayerInfo
    };

    // send information with information container
    this.socketService.ShareInformation(infoContainer);

    this.appService.SetLoading(false);
    this.router.navigate(["../lobby"], {relativeTo: this.route})
  }

}
