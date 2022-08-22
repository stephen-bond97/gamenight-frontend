import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';

import { SocketService } from './services/socket.service';
import { ShellComponent } from './shell/shell.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SplashComponent } from './components/splash/splash.component';
import { TriviaService } from './services/trivia.service';
import { HttpClientModule } from '@angular/common/http';
import { CreateLobbyComponent } from './components/create-lobby/create-lobby.component';
import { AppService } from './services/app.service';
import { TriviaStateService } from './services/trivia-state.service';
import { RouterModule } from '@angular/router';
import { LobbyComponent } from './components/lobby/lobby.component';
import { JoinLobbyComponent } from './components/join-lobby/join-lobby.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { StorageService } from './services/storage.service';
import { HomePage } from './pages/home/home.page';
import { TriviaPage } from './pages/trivia/trivia.page';
import { TriviaGameComponent } from './components/trivia-game/trivia-game.component';
import { CategorySelectorComponent } from './components/trivia-game/category-selector/category-selector.component';
import { LeaderboardComponent } from './components/trivia-game/leaderboard/leaderboard.component';
import { WheelOfFortuneComponent } from './components/wheel-of-fortune-game/wheel-of-fortune-game.component';
import { PhraseService } from './services/phrase.service';
import { WheelOfFortunePage } from './pages/wheel-of-fortune/wheel-of-fortune.page';
import { GameStateService } from './services/game-state.service';
import { WheelOfFortuneStateService } from './services/wheel-of-fortune.state.service';
import { WheelCategorySelectorComponent } from './components/wheel-of-fortune-game/wheel-category-selector/wheel-category-selector.component';

// const config: SocketIoConfig = { url: 'https://sbond-gamenight.herokuapp.com/', options: {} };
const config: SocketIoConfig = { url: 'http://localhost:3000/', options: {} };


@NgModule({
  declarations: [
    // Shared Components
    ShellComponent,
    SplashComponent,
    CreateLobbyComponent,
    LobbyComponent,
    JoinLobbyComponent,
    CreateProfileComponent,

    // Trivia Components
    TriviaGameComponent,
    CategorySelectorComponent,
    LeaderboardComponent,

    // Wheel Of Fortune Components
    WheelOfFortuneComponent,
    WheelCategorySelectorComponent,
    
    // Pages
    HomePage,
    TriviaPage,
    WheelOfFortunePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [SocketService, TriviaService, AppService, GameStateService, TriviaStateService, WheelOfFortuneStateService, StorageService, PhraseService],
  bootstrap: [ShellComponent]
})
export class AppModule { }
