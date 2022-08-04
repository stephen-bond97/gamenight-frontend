import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CreateLobbyComponent } from './components/create-lobby/create-lobby.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { HomePage } from './pages/home/home.page';
import { TriviaPage } from './pages/trivia/trivia.page';

const routes: Routes = [{
  path: "", redirectTo: "home", pathMatch: 'full'
}, {
  path: "home", component: HomePage
}, {
  path: "trivia", component: TriviaPage,
  children: [{
    path: "create-lobby",
    component: CreateLobbyComponent
  }, {
    path: "lobby",
    component: LobbyComponent
  }]
}];

@NgModule({
  declarations: [HomePage, TriviaPage],
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
