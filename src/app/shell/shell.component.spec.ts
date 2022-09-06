import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AppServiceSpy } from 'src/testing/spies/app.service.spy';
import { SocketServiceSpy } from 'src/testing/spies/socket.service.spy';
import { AppService } from '../services/app.service';
import { SocketService } from '../services/socket.service';

import { ShellComponent } from './shell.component';

class MatDialogRefSpy {
  close = jasmine.createSpy("close");
}

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShellComponent ],
      imports: [MatDialogModule],
      providers: [
        { provide: AppService, useClass: AppServiceSpy }, 
        { provide: SocketService, useClass: SocketServiceSpy }, 
        { provide: MatDialogRef, useClass: MatDialogRefSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
