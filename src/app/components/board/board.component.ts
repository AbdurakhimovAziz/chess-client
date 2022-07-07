import { Component, Input, OnInit } from '@angular/core';
import { Board } from 'src/app/shared/models/game/Board';
import { Cell } from 'src/app/shared/models/game/Cell';
import { GameViewService } from 'src/app/shared/services/game-view.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Input() board!: Board;

  constructor(private gameViewService: GameViewService) {}

  ngOnInit(): void {
    this.gameViewService.activeCell$.subscribe((cell) =>
      this.gameViewService.highlightCells(cell)
    );
  }

  public onCellClick(cell: Cell): void {
    this.gameViewService.setActiveCell(cell);
  }

  getActiveCell(): Cell | null {
    return this.gameViewService.getActiveCell();
  }
}
