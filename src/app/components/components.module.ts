import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppMaterialModule } from '../shared/modules/app-material.module';
import { MainComponent } from './main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { BoardComponent } from './board/board.component';
import { CellComponent } from './cell/cell.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { LobbyItemComponent } from './lobby-item/lobby-item.component';
import { PlayerComponent } from './player/player.component';
import { LobbyCreateDialogComponent } from './home/lobby-create-dialog/lobby-create-dialog.component';
import { GameOverDialogComponent } from './game/game-over-dialog/game-over-dialog.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    MainComponent,
    BoardComponent,
    CellComponent,
    GameComponent,
    HomeComponent,
    HeaderComponent,
    LobbyItemComponent,
    PlayerComponent,
    LobbyCreateDialogComponent,
    GameOverDialogComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
})
export class ComponentsModule {}
