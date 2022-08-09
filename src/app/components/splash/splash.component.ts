import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {

  @HostBinding('class.minimised')
  public Minimised = false;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.Minimised = true;
    }, 2000);
  }

}
