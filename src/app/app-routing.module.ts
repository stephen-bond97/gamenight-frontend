import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { TriviaPage } from './pages/trivia/trivia.page';

const routes: Routes = [{
  path: "", redirectTo: "home", pathMatch: 'full' 
},{
  path: "home", component: HomePage
}, {
  path: "trivia", component: TriviaPage
}];

@NgModule({
  declarations: [HomePage, TriviaPage],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
