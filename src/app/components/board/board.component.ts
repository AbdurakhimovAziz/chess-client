import { CdkDragEnd } from '@angular/cdk/drag-drop';
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
    this.gameViewService.activeCell$.subscribe((cell) => {
      this.gameViewService.highlightCells(cell);
      console.log('active cell', cell);
    });
  }

  public onCellClick(cell: Cell): void {
    const board = this.board;
    const activeCell = this.getActiveCell();
    if (
      activeCell &&
      activeCell !== cell &&
      activeCell.getFigure()?.canMove(board, activeCell, cell)
    ) {
      console.log('move');

      this.gameService.moveFigure(activeCell, cell);
      this.gameViewService.setActiveCell(null);
    } else if (!cell.isEmpty()) {
      console.log('select');

      this.gameViewService.setActiveCell(cell);
    }
  }

  public getActiveCell(): Cell | null {
    return this.gameViewService.getActiveCell();
  }

  public dragStarted(cell: Cell) {
    console.log('drag started');

    this.gameViewService.setActiveCell(cell);
  }

  public dragEnded(event: CdkDragEnd, cell: Cell) {
    // TODO: refactor, implement resetting figure's position
    const activeCell = this.getActiveCell();
    console.log(cell, event.distance);

    if (activeCell) {
      const x = Math.round(activeCell.x + event.distance.x / 64);
      const y = Math.round(activeCell.y + event.distance.y / 64);
      const cell = this.board.getCell(x, y);
      const board = this.board;
      if (
        activeCell &&
        activeCell !== cell &&
        activeCell.getFigure()?.canMove(board, activeCell, cell)
      ) {
        console.log('move');

        this.gameService.moveFigure(activeCell, cell);
        this.gameViewService.setActiveCell(null);
      }
      console.log('cell', cell);

      console.log('drag ended', x, y);

      this.gameViewService.setActiveCell(null);
      console.log('active cell', this.getActiveCell());
    }
  }
}
