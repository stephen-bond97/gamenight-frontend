import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CreateLobbyComponent } from './components/create-lobby/create-lobby.component';
import { JoinLobbyComponent } from './components/join-lobby/join-lobby.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { TriviaGameComponent } from './components/trivia-game/trivia-game.component';
import { WheelOfFortuneComponent } from './components/wheel-of-fortune-game/wheel-of-fortune-game.component';
import { LobbyGuard } from './guards/lobby.guard';
import { HomePage } from './pages/home/home.page';
import { TriviaPage } from './pages/trivia/trivia.page';
import { WheelOfFortunePage } from './pages/wheel-of-fortune/wheel-of-fortune.page';


const sharedRoutes: Routes = [{
  path: "",
  redirectTo: "/home",
  pathMatch: "full"
}, {
  path: "create-lobby",
  component: CreateLobbyComponent
}, {
  path: "join-lobby",
  component: JoinLobbyComponent
}, {
  path: "lobby",
  component: LobbyComponent,
  canActivate: [LobbyGuard]
}];

const routes: Routes = [{
  path: "", redirectTo: "home", pathMatch: "full"
}, {
  path: "home", component: HomePage
}, {
  path: ":Mode/join/:LobbyCode",
  component: JoinLobbyComponent
}, {
  path: "trivia", component: TriviaPage,
  children: [
    ...sharedRoutes,
    {
      path: "game",
      component: TriviaGameComponent,
      canActivate: [LobbyGuard]
    }
  ]
}, {
  path: "",
  component: WheelOfFortunePage,
  children: [
    ...sharedRoutes,
    {
      path: "game",
      component: WheelOfFortuneComponent,
      canActivate: [LobbyGuard]
    }
  ]
}];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
