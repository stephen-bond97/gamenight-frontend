import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelOfFortuneComponent } from './wheel-of-fortune-game.component';

describe('WheelOfFortuneComponent', () => {
  let component: WheelOfFortuneComponent;
  let fixture: ComponentFixture<WheelOfFortuneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WheelOfFortuneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WheelOfFortuneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
