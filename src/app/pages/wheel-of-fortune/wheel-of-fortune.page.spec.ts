import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelOfFortunePage } from './wheel-of-fortune.page';

describe('WheelOfFortunePage', () => {
  let component: WheelOfFortunePage;
  let fixture: ComponentFixture<WheelOfFortunePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WheelOfFortunePage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WheelOfFortunePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
