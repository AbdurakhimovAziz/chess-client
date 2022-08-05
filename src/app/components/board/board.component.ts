import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CELL_WIDTH } from 'src/app/shared/constants';
import { Board } from 'src/app/shared/models/game/Board';
import { Cell } from 'src/app/shared/models/game/Cell';
import { King } from 'src/app/shared/models/game/figures/King';
import { GameViewService } from 'src/app/shared/services/game-view.service';
import { GameService } from 'src/app/shared/services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() board!: Board;
  @Output() public onDragStarted = new EventEmitter<Cell>();
  @Output() public onDragEnded = new EventEmitter<CdkDragEnd>();

  constructor(
    private gameService: GameService,
    private gameViewService: GameViewService
  ) {}

  public handleMove(cell: Cell): void {
    const activeCell = this.getActiveCell();
    this.gameService.handleMove(activeCell, cell);
  }

  public dragStarted(cell: Cell): void {
    if (this.gameService.isRightTurn(cell.getFigure()?.color!) && this.gameService.isGameInProgress()) {
      this.gameViewService.setIsDragging(true);
      this.gameViewService.setActiveCell(cell);
    }
  }

  public dragEnded(event: CdkDragEnd): void {
    const activeCell = this.getActiveCell();

    if (activeCell) {
      // TODO: recalculate if board is rotated
      const x = Math.round(activeCell.x + event.distance.x / CELL_WIDTH);
      const y = Math.round(activeCell.y + event.distance.y / CELL_WIDTH);
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

  public isKingInCheck(cell: Cell | null): boolean {
    if (!cell) return false;

    const figure = cell.getFigure();
    if (!figure || !(figure instanceof King)) return false;

    return figure.isInCheck();
  }

  public getActiveCell(): Cell | null {
    return this.gameViewService.getActiveCell();
  }
}
