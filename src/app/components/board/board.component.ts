import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { CELL_WIDTH } from 'src/app/shared/constants';
import { Board } from 'src/app/shared/models/game/Board';
import { Cell } from 'src/app/shared/models/game/Cell';
import { Figure } from 'src/app/shared/models/game/figures/Figure';
import { FigureTypes } from 'src/app/shared/models/game/figures/Figure-types';
import { Player } from 'src/app/shared/models/game/Player';
import { GameViewService } from 'src/app/shared/services/game-view.service';
import { GameService } from 'src/app/shared/services/game.service';
import { MoveService } from 'src/app/shared/services/move.service';
import { CellChecker } from 'src/app/shared/utils/cell-checker';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Input() board!: Board;

  private currentPlayer!: Player;

  constructor(
    private gameService: GameService,
    private gameViewService: GameViewService,
    private moveService: MoveService
  ) {}

  ngOnInit(): void {
    this.gameViewService.activeCell$.subscribe((cell) =>
      this.gameViewService.highlightCells(cell)
    );

    this.gameService.currentPlayer$.subscribe(
      (player) => (this.currentPlayer = player)
    );

    this.moveService.lastMove$.subscribe((move) => {
      if (move) this.gameService.swapCurrentPlayer();
    });
  }

  public handleMove(cell: Cell): void {
    const activeCell = this.getActiveCell();

    if (activeCell && activeCell !== cell && cell.isAvailable()) {
      this.gameService.moveFigure(activeCell, cell);
      this.gameViewService.setActiveCell(null);
    } else if (
      !cell.isEmpty() &&
      this.gameService.isRightTurn(cell.getFigure()?.color!)
    )
      this.gameViewService.setActiveCell(cell);
  }

  public getActiveCell(): Cell | null {
    return this.gameViewService.getActiveCell();
  }

  public dragStarted(cell: Cell) {
    if (this.gameService.isRightTurn(cell.getFigure()?.color!)) {
      this.gameViewService.setIsDragging(true);
      this.gameViewService.setActiveCell(cell);
    }
  }

  public dragEnded(event: CdkDragEnd) {
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

  public isKingUnderCheck(figure: Figure | null): boolean {
    if (!figure || figure.type !== FigureTypes.KING) return false;

    return CellChecker.isKingUderCheck(this.board, figure);
  }
}
