import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/services/app.service';
import { PlayerInfo } from 'src/typings/playerInfo';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {
  public Nickname = "";
  public Avatar = "";

  public AvatarList = [
    "fox",
    "monke",
    "squirrel",
    "raccoon",
    "deer",
    "dog",
    "floppy_dog",
    "pig",
    "fox_2"
  ];

  public constructor(public dialogRef: MatDialogRef<CreateProfileComponent>, private appService: AppService) { }

  ngOnInit(): void {
  }

  public SaveProfile(): void {
    let profile: PlayerInfo = {
      Name: this.Nickname,
      Avatar: this.Avatar,
      Score: 0
    };
    this.appService.UpdateProfile(profile);
    this.dialogRef.close();
  }

  public HandleAvatarClick(avatarPath: string): void {
    this.Avatar = avatarPath;
  }

  public IsAvatarSelected(avatarPath: string): boolean {
    if (this.Avatar == avatarPath) {
      return true;
    }
    
    return false;
  }

}
