import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule
  ]
})
export class MaterialModule { }
