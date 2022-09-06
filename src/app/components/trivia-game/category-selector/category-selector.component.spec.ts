import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TriviaStateService } from 'src/app/services/trivia-state.service';
import { TriviaStateServiceSpy } from 'src/testing/spies/trivia-state.service.spy';

import { CategorySelectorComponent } from './category-selector.component';

describe('CategorySelectorComponent', () => {
  let component: CategorySelectorComponent;
  let fixture: ComponentFixture<CategorySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorySelectorComponent ],
      providers: [
        { provide: TriviaStateService, useClass: TriviaStateServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
