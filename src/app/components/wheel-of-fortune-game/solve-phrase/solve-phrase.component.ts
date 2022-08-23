import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-solve-phrase',
  templateUrl: './solve-phrase.component.html',
  styleUrls: ['./solve-phrase.component.scss']
})
export class SolvePhraseComponent {
  public PhraseChoice = "";

  constructor(public dialogRef: MatDialogRef<SolvePhraseComponent>) { }

  public SolvePhrase(): void {
    this.dialogRef.close(this.PhraseChoice);
  }
}
