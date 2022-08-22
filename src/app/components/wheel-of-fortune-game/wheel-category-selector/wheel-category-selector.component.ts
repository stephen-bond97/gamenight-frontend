import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { WheelOfFortuneStateService } from 'src/app/services/wheel-of-fortune.state.service';
import { PhraseCategory, PhraseCategory2LabelMapping } from 'src/typings/phraseCategory.enum';

@Component({
  selector: 'app-wheel-category-selector',
  templateUrl: './wheel-category-selector.component.html',
  styleUrls: ['./wheel-category-selector.component.scss']
})
export class WheelCategorySelectorComponent implements OnInit {
  public get SelectedCategory(): PhraseCategory {
    return this.wheelService.SelectedCategory!;
  }

  private text = '';

  scale = 25;  // Font size and overall scale
  breaks = 0.003;  // Speed loss per frame
  endSpeed = 0.10;  // Speed at which the letter stops
  firstLetter = 60;  // Number of frames until the first letter stopps (60 frames per second)
  delay = 20;  // Number of frames between letters stopping

  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null | undefined = null;
  private characters: string[] = [];
  private availableCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ '.split('');
  private availableCharactersMap: Map<string, number> = new Map<string, number>();
  private offset: number[] = [];
  private offsetV: number[] = [];

  public constructor(private wheelService: WheelOfFortuneStateService) { }

  ngOnInit(): void {
    this.text = PhraseCategory2LabelMapping[this.SelectedCategory].toUpperCase();

    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas?.getContext('2d');

    this.characters = this.text.split('');

    this.initialiseCharacterMap();

    requestAnimationFrame(() => this.animationLoop());
  }

  private initialiseCharacterMap() {
    for (let i = 0; i < this.availableCharacters.length; i++) {
      this.availableCharactersMap.set(this.availableCharacters[i], i);
    }

    for (let i = 0; i < this.text.length; i++) {
      let f = this.firstLetter + this.delay * i;
      this.offsetV[i] = this.endSpeed + this.breaks * f;
      this.offset[i] = -(1 + f) * (this.breaks * f + 2 * this.endSpeed) / 2;
    }
  }

  private animationLoop(): void {
    if (!this.canvas || !this.ctx) {
      return;
    }

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = '#622';
    this.ctx.fillRect(0, (this.canvas.height - this.scale) / 2, this.canvas.width, this.scale);
    for (let i = 0; i < this.characters.length; i++) {
      this.ctx.fillStyle = '#ccc';
      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = 'center';
      this.ctx.setTransform(1, 0, 0, 1, Math.floor((this.canvas.width - this.scale * (this.characters.length - 1)) / 2), Math.floor(this.canvas.height / 2));
      let o = this.offset[i];
      while (o < 0) o++;
      o %= 1;
      let h = Math.ceil(this.canvas.height / 2 / this.scale)
      for (let j = -h; j < h; j++) {
        let charFromMap = this.availableCharactersMap.get(this.characters[i]);
        let c = charFromMap! + j - Math.floor(this.offset[i]);
        while (c < 0) c += this.availableCharacters.length;
        c %= this.availableCharacters.length;
        let s = 1 - Math.abs(j + o) / (this.canvas.height / 2 / this.scale + 1)
        this.ctx.globalAlpha = s
        this.ctx.font = this.scale * s + 'px Helvetica'
        this.ctx.fillText(this.availableCharacters[c], this.scale * i, (j + o) * this.scale);
      }
      this.offset[i] += this.offsetV[i];
      this.offsetV[i] -= this.breaks;
      if (this.offsetV[i] < this.endSpeed) {
        this.offset[i] = 0;
        this.offsetV[i] = 0;
      }
    }

    requestAnimationFrame(() => this.animationLoop());

  }


}
