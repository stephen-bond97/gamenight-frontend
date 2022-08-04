import { Component, OnInit } from '@angular/core';
import { TriviaService } from 'src/app/services/trivia.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.page.html',
  styleUrls: ['./trivia.page.scss']
})
export class TriviaPage implements OnInit {

  ngOnInit(): void {
  }

}
