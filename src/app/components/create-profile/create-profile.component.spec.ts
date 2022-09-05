import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/services/app.service';
import { AppServiceSpy } from 'src/testing/spies/app.service.spy';

import { CreateProfileComponent } from './create-profile.component';

describe('CreateProfileComponent', () => {
  let component: CreateProfileComponent;
  let fixture: ComponentFixture<CreateProfileComponent>;
  let componentElement: HTMLElement;

  class MatDialogRefSpy {
    close = jasmine.createSpy("close");
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProfileComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: AppService, useClass: AppServiceSpy },
        { provide: MatDialogRef, useClass: MatDialogRefSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    componentElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not allow profile creation with no name', () => {

    // arrange
    let avatars = componentElement.querySelectorAll(".avatar-container > div");
    let firstAvatar = avatars[0] as HTMLDivElement;

    // act
    firstAvatar.click();
    fixture.detectChanges();

    // assert    
    let button = componentElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });
  
  it('should not allow profile creation with no avatar', () => {

    // arrange 
    let nameInput = componentElement.querySelector('input') as HTMLInputElement;

    // act
    nameInput.value = "name";
    nameInput.dispatchEvent(new Event('input'));

    // assert
    let button = componentElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });

  it('should not allow profile creation with no name or avatar', () => {
    
    // assert
    let button = componentElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });

  it('should allow profile creation with name and avatar', () => {
    
    // arrange
    let avatars = componentElement.querySelectorAll(".avatar-container > div");
    let firstAvatar = avatars[0] as HTMLDivElement;
    let nameInput = componentElement.querySelector('input') as HTMLInputElement;

    // act
    firstAvatar.click();
    nameInput.sendKeys("name");
    fixture.detectChanges();

    // assert
    let button = componentElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBeFalse();
  });

  it('should allow profile creation with name and avatar', () => {
    
    // arrange
    let avatars = componentElement.querySelectorAll(".avatar-container > div");
    let firstAvatar = avatars[0] as HTMLDivElement;
    let nameInput = componentElement.querySelector('input') as HTMLInputElement;
    let appServiceSpy = TestBed.inject(AppService);

    // act
    firstAvatar.click();
    nameInput.sendKeys("name");
    fixture.detectChanges();
    
    let button = componentElement.querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    

    // assert
    expect(appServiceSpy.UpdateProfile).toHaveBeenCalledOnceWith({
      Avatar: "fox",
      Name: "name",
      Score: 0
    });
  });

});
