import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelOfFortuneStateService } from 'src/app/services/wheel-of-fortune.state.service';
import { PhraseCategory } from 'src/typings/phraseCategory.enum';
import { WheelCategorySelectorComponent } from './wheel-category-selector.component';

describe('WheelCategorySelectorComponent', () => {
  let component: WheelCategorySelectorComponent;
  let fixture: ComponentFixture<WheelCategorySelectorComponent>;

  class WheelOfFortuneStateServiceSpy {
    SelectedCategory = PhraseCategory.Music;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WheelCategorySelectorComponent ],
      providers: [
        { provide: WheelOfFortuneStateService, useClass: WheelOfFortuneStateServiceSpy}
      ]
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
