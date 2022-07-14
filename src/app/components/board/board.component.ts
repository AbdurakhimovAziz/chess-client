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
    this.gameViewService.activeCell$.subscribe((cell) =>
      this.gameViewService.highlightCells(cell)
    );
  }

  public handleMove(cell: Cell): void {
    const board = this.board;
    const activeCell = this.getActiveCell();
    if (
      activeCell &&
      activeCell !== cell &&
      activeCell.getFigure()?.canMove(board, activeCell, cell)
    ) {
      this.gameService.moveFigure(activeCell, cell);
      this.gameViewService.setActiveCell(null);
    } else if (!cell.isEmpty()) this.gameViewService.setActiveCell(cell);
  }

  public getActiveCell(): Cell | null {
    return this.gameViewService.getActiveCell();
  }

  public dragStarted(cell: Cell) {
    this.gameViewService.setIsDragging(true);
    this.gameViewService.setActiveCell(cell);
  }

  public dragEnded(event: CdkDragEnd) {
    const activeCell = this.getActiveCell();

    if (activeCell) {
      const x = Math.round(activeCell.x + event.distance.x / 64);
      const y = Math.round(activeCell.y + event.distance.y / 64);
      if (
        (x !== activeCell.x || y !== activeCell.y) &&
        x < 8 &&
        y < 8 &&
        x >= 0 &&
        y >= 0
      ) {
        const cell = this.board.getCell(x, y);
        this.handleMove(cell);
      }
      this.gameViewService.setIsDragging(false);
      this.gameViewService.setActiveCell(null);
    }
  }
}
