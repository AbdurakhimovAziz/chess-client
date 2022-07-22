import { Injectable, Injector } from '@angular/core';
import { Board } from '../models/game/Board';
import { Cell } from '../models/game/Cell';
import { FigureTypes } from '../models/game/figures/Figure-types';
import { Pawn } from '../models/game/figures/Pawn';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class MoveSimulatorService {
  private boardCopy!: Board;

  constructor(private injector: Injector) {}

  public isMoveLegal(start: Cell | null, end: Cell): boolean {
    if (!start) return false;
    const startCopy = this.boardCopy.getCell(start.x, start.y);
    const endCopy = this.boardCopy.getCell(end.x, end.y);
    const color = startCopy.getFigure()?.color;
    const gameService = this.injector.get(GameService);

    if (
      (startCopy &&
        startCopy !== endCopy &&
        startCopy.getFigure()?.canMove(this.boardCopy, startCopy, endCopy)) ||
      gameService.isEnpassantPossible(startCopy, endCopy)
    ) {
      const king = color && this.boardCopy.getKing(color);
      const boardSnap = this.boardCopy.getCopy();

      const targetFigure = gameService.performMove(
        this.boardCopy,
        startCopy,
        endCopy
      );

      this.boardCopy.setFigures(
        this.boardCopy.getFigures().filter((figure) => figure !== targetFigure)
      );

      const isCheck = gameService.isKingInCheck(this.boardCopy, king);
      this.setBoardCopy(boardSnap);
      return !isCheck;
    }
    return false;
  }

  public setBoardCopy(board: Board): void {
    this.boardCopy = board.getCopy();
  }
}
