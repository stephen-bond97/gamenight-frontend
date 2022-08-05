import { TestBed } from '@angular/core/testing';

import { TriviaLobbyGuard } from './trivia-lobby.guard';

describe('AuthGuard', () => {
  let guard: TriviaLobbyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TriviaLobbyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
