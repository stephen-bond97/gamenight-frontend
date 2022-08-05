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
  }

  ngOnInit(): void {
  }
}
