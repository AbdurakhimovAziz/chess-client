import { Component, Input } from '@angular/core';
import { Player } from 'src/app/shared/models/game/Player';
import { GameService } from 'src/app/shared/services/game.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @Input() player!: Player;

  constructor(private gameService: GameService) {}

  public isPlayersTurn(): boolean {
    return this.gameService.getCurrentPlayer().color === this.player.color;
  }

  public isWinner(): boolean {
    return (
      this.gameService.getGameResult() === 'draw' ||
      this.player.color + ' won' === this.gameService.getGameResult()
    );
  }
}
