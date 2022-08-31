import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  public LobbyCode = "";
  public LobbyState = "";

  public ShowEasterEgg = false;

  private title: HTMLElement | null = null;
  private titleStyles: CSSStyleDeclaration | null = null;
  private textWidth = 0;
  private initialPosition = 0;

  public constructor() {
  }

  ngOnInit(): void {

    this.title = document.getElementById("text");

    this.titleStyles = getComputedStyle(this.title!);
    this.textWidth = this.intPropertyValue("width");
    this.initialPosition = this.intPropertyValue("background-position");
  }

  public ToggleEasterEgg(): void {
    this.ShowEasterEgg = true;

    let trigger = false;

    setInterval(() => {

        let bgPosition = this.intPropertyValue("background-position");
        
        if (bgPosition == this.textWidth) trigger = false;
        if (bgPosition == this.initialPosition) trigger = true;

        if (trigger) {
            this.title!.style.backgroundPosition = this.textWidth + "px top";
        }
        if (!trigger) {
            this.title!.style.backgroundPosition = this.initialPosition + "px top";
        }
      }, 500);
  }

  private intPropertyValue(prop: string): number {
    return parseInt(this.titleStyles!.getPropertyValue(`${prop}`));
  }
}