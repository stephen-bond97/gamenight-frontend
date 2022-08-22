import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelCategorySelectorComponent } from './wheel-category-selector.component';

describe('WheelCategorySelectorComponent', () => {
  let component: WheelCategorySelectorComponent;
  let fixture: ComponentFixture<WheelCategorySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WheelCategorySelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WheelCategorySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
