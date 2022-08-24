import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionDialog } from './exception.dialog';

describe('ExceptionDialogDialog', () => {
  let component: ExceptionDialog;
  let fixture: ComponentFixture<ExceptionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExceptionDialog ]
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
