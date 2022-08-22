import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SocketService } from 'src/app/services/socket.service';
import { WheelOfFortuneStateService } from 'src/app/services/wheel-of-fortune.state.service';
import { InformationType } from 'src/typings/informationType.enum';

@Component({
  selector: 'app-solve-phrase',
  templateUrl: './solve-phrase.component.html',
  styleUrls: ['./solve-phrase.component.scss']
})
export class SolvePhraseComponent implements OnInit {
  public PhraseChoice = "";

  constructor(private wheelState: WheelOfFortuneStateService, public dialogRef: MatDialogRef<SolvePhraseComponent>, private socketService: SocketService) { }

  ngOnInit(): void {
  }

  public SolvePhrase(): void {
    this.socketService.ShareInformation({
      InformationType: InformationType.SolvePhrase,
      Data: this.PhraseChoice
    });

    this.dialogRef.close();
  }
}
