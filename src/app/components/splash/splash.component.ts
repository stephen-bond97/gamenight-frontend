import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {

  @HostBinding('class.full-screen')
  public ShowFullscreen = true;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.ShowFullscreen = false;
    }, 3000);
  }

}
