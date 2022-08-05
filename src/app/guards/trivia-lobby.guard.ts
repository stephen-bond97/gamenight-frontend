import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TriviaStateService } from '../services/trivia-state.service';

@Injectable({
  providedIn: 'root'
})
export class TriviaLobbyGuard implements CanActivate {



  constructor(private triviaState: TriviaStateService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state:RouterStateSnapshot): boolean | UrlTree {
    if (this.triviaState.LobbyCode.length > 0) {
      return true;
    }

    return this.router.parseUrl("/home");
  }

}
