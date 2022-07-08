import { Component, Input, OnInit } from '@angular/core';
import { Board } from 'src/app/shared/models/game/Board';
import { Cell } from 'src/app/shared/models/game/Cell';
import { GameViewService } from 'src/app/shared/services/game-view.service';
import { GameService } from 'src/app/shared/services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Input() board!: Board;

  constructor(
    private gameService: GameService,
    private gameViewService: GameViewService
  ) {}

  ngOnInit(): void {
    this.gameViewService.activeCell$.subscribe((cell) =>
      this.gameViewService.highlightCells(cell)
    );
  }

  public onCellClick(cell: Cell): void {
    const board = this.board;
    const activeCell = this.getActiveCell();
    if (
      activeCell &&
      activeCell !== cell &&
      activeCell.getFigure()?.canMove(board, activeCell, cell)
    ) {
      this.gameService.moveFigure(activeCell, cell);
      this.gameViewService.setActiveCell(null);
    } else if (cell.getFigure()) this.gameViewService.setActiveCell(cell);
  }

  getActiveCell(): Cell | null {
    return this.gameViewService.getActiveCell();
  }
}
