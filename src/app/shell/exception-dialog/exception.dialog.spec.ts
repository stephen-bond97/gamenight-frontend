import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/services/app.service';

import { ExceptionDialog } from './exception.dialog';

describe('ExceptionDialog', () => {
  let component: ExceptionDialog;
  let fixture: ComponentFixture<ExceptionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExceptionDialog ],
      providers: [
        { provide: AppService, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {}
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExceptionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
