import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameResult } from 'src/app/shared/models/game/game-result';

@Component({
  selector: 'app-game-over-dialog',
  templateUrl: './game-over-dialog.component.html',
  styleUrls: ['./game-over-dialog.component.scss'],
})
export class GameOverDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: GameResult) {}
}
