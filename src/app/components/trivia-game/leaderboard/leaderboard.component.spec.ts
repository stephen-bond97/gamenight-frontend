import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameStateService } from 'src/app/services/game-state.service';
import { WheelOfFortuneStateService } from 'src/app/services/wheel-of-fortune.state.service';
import { GameStateServiceSpy } from 'src/testing/spies/game-state.service.spy';
import { PlayerInfo } from 'src/typings/playerInfo';

import { LeaderboardComponent } from './leaderboard.component';

class wheelStateServiceSpy { 
  SelectedPlayer: PlayerInfo = {
    Name: "test",
    Avatar: "fox",
    Score: 0
  }
}

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaderboardComponent ],
      providers: [
        { provide: GameStateService, useClass: GameStateServiceSpy },
        { provide: WheelOfFortuneStateService, useClass: wheelStateServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
