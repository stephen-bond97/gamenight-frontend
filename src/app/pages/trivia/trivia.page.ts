import { Component, OnInit } from '@angular/core';
import { TriviaService } from 'src/app/services/trivia.service';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.page.html',
  styleUrls: ['./trivia.page.scss']
})
export class TriviaPage implements OnInit {

  public constructor(private trivia: TriviaService) { }

  ngOnInit(): void {
    this.trivia.GetQuestions("videogames")
    .subscribe((data: any) => console.log(data));
  }

}
