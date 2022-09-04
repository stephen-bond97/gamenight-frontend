import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/services/app.service';
import { AppServiceSpy } from 'src/testing/spies/app.service.spy';

import { ExceptionDialog } from './exception.dialog';

describe('ExceptionDialog', () => {
  let component: ExceptionDialog;
  let fixture: ComponentFixture<ExceptionDialog>;
  let componentElement: HTMLElement;

  class MatDialogRefSpy {
    close = jasmine.createSpy("close");
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExceptionDialog ],
      providers: [
        { provide: AppService, useClass: AppServiceSpy },
        { provide: MatDialogRef, useClass: MatDialogRefSpy },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {message: "testmessage"}
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExceptionDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
    componentElement = fixture.debugElement.nativeElement;
  });

  it('should create',() => {
    expect(component).toBeTruthy();
  });

  it('should show message', () => {
    
    // arrange
    let div = componentElement.querySelector('div') as HTMLDivElement;

    // assert
    expect(div.innerText).toContain("testmessage");
  });

  it('should close dialog on close button click', () => {

    // arrange
    let button = componentElement.querySelector('button') as HTMLButtonElement;
    let appServiceSpy = TestBed.inject(AppService);
    let matDialogSpy = TestBed.inject(MatDialogRef);

    // act
    button.click();

    // assert
    expect(appServiceSpy.SetLoading).toHaveBeenCalledOnceWith(false);
    expect(matDialogSpy.close).toHaveBeenCalledTimes(1);
  });
});