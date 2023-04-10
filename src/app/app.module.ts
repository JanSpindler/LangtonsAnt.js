import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LangtonsAntGameComponent } from './components/langtons-ant-game/langtons-ant-game.component';

@NgModule({
  declarations: [
    AppComponent,
    LangtonsAntGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
