import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CreateLobbyComponent } from './components/create-lobby/create-lobby.component';
import { JoinLobbyComponent } from './components/join-lobby/join-lobby.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { TriviaGameComponent } from './components/trivia-game/trivia-game.component';
import { TriviaLobbyGuard } from './guards/trivia-lobby.guard';
import { HomePage } from './pages/home/home.page';
import { TriviaPage } from './pages/trivia/trivia.page';

const routes: Routes = [{
  path: "", redirectTo: "home", pathMatch: "full"
}, {
  path: "home", component: HomePage
}, {
  path: "trivia", component: TriviaPage,
  children: [{
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
    path: "join-lobby/:LobbyCode",
    component: JoinLobbyComponent
  }, {
    path: "game",
    component: TriviaGameComponent,
    canActivate: [TriviaLobbyGuard]
  }, {
    path: "lobby",
    component: LobbyComponent,
    canActivate: [TriviaLobbyGuard]
  },]
}];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
