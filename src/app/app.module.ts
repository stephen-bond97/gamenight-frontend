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
import { TestComponent } from './components/test/test.component';
import { TriviaService } from './services/trivia.service';

const config: SocketIoConfig = { url: 'https://sbond-gamenight.herokuapp.com/', options: {} };

@NgModule({
  declarations: [
    ShellComponent,
    SplashComponent,
    TestComponent // todo remove this when finished
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [SocketService, TriviaService],
  bootstrap: [ShellComponent]
})
export class AppModule { }
