import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-exception-dialog',
  templateUrl: './exception.dialog.html',
  styleUrls: ['./exception.dialog.scss']
})
export class ExceptionDialog implements OnInit {

  @Input()
  public get Message(): string {
    return this.data?.message;
  } 

  public constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ExceptionDialog>, private appService: AppService) {
  }

  ngOnInit(): void {
  }

  public Close(): void {
    this.dialogRef.close();
    this.appService.SetLoading(false);
  }

}
