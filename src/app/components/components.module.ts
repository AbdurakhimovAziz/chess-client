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

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    MainComponent,
    BoardComponent,
    CellComponent,
    GameComponent,
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
