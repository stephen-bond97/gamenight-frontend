import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProfileComponent } from '../components/create-profile/create-profile.component';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  public loading = false;


  ngOnInit(): void {
    if (!this.appService.PlayerInfo) {
      this.openDialog();
    }
  }

  /**
   *
   */
  public constructor(private appService: AppService, private dialog: MatDialog) {
    this.appService.LoadingStateChange.subscribe((loading) => this.loading = loading);
  }

  openDialog(): void {
    this.dialog.open(CreateProfileComponent, {
      enterAnimationDuration: "500ms",
      exitAnimationDuration: "100ms",
      disableClose: true
    });
  }
}
