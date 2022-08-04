import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  public loading = false;


  ngOnInit(): void {
  }

  /**
   *
   */
  public constructor(private appService: AppService) {
    this.appService.LoadingStateChange.subscribe((loading) => this.loading = loading);
  }
}
