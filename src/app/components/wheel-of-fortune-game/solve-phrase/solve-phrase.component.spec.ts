import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolvePhraseComponent } from './solve-phrase.component';

xdescribe('SolvePhraseComponent', () => {
  let component: SolvePhraseComponent;
  let fixture: ComponentFixture<SolvePhraseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolvePhraseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolvePhraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
