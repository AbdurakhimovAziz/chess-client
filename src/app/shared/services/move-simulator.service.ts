import { Injectable, Injector } from '@angular/core';
import { Board } from '../models/game/Board';
import { Cell } from '../models/game/Cell';
import { Colors } from '../models/game/Colors';
import { FigureTypes } from '../models/game/figures/Figure-types';
import { Pawn } from '../models/game/figures/Pawn';
import { Point } from '../models/game/Point';
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
      gameService.isEnpassantPossible(startCopy, endCopy) ||
      gameService.isCastlingPossible(startCopy, endCopy)
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

  public getAllPossibleMoves(color: Colors): Point[] {
    const board = this.boardCopy;
    const figures = board.getFiguresByColor(color);
    const cells = board.getCells();
    const possibleMoves: Point[] = [];

    for (let figure of figures) {
      for (let row of cells) {
        for (let cell of row) {
          const start = board.getCell(figure.x, figure.y);
          if (this.isMoveLegal(start, cell)) {
            possibleMoves.push(new Point(cell.x, cell.y));
          }
        }
      }
    }
    console.log('possible moves', possibleMoves);
    return possibleMoves;
  }

  public setBoardCopy(board: Board): void {
    this.boardCopy = board.getCopy();
  }
}
