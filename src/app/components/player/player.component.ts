import { Component, Input } from '@angular/core';
import { Player } from 'src/app/shared/models/game/Player';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @Input() player!: Player;
}
