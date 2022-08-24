import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProfileComponent } from '../components/create-profile/create-profile.component';
import { AppService } from '../services/app.service';
import { SocketService } from '../services/socket.service';
import { ExceptionDialog } from './exception-dialog/exception.dialog';

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
  public constructor(private appService: AppService, private socketService: SocketService, private dialog: MatDialog) {
    this.appService.LoadingStateChange.subscribe((loading) => this.loading = loading);
    this.socketService.Exception.subscribe((message) => this.showExceptionDialog(message));
  }

  private openDialog(): void {
    this.dialog.open(CreateProfileComponent, {
      enterAnimationDuration: "500ms",
      exitAnimationDuration: "100ms",
      disableClose: true
    });
  }

  private showExceptionDialog(message: string): void {
    this.dialog.open(ExceptionDialog, {
      enterAnimationDuration: "500ms",
      exitAnimationDuration: "100ms",
      data: {
        message: message
      },
      disableClose: true
    });
  }
}
