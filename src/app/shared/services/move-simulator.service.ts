import { Injectable, Injector } from '@angular/core';
import { Board } from '../models/game/Board';
import { Cell } from '../models/game/Cell';
import { Colors } from '../models/game/Colors';
import { FigureTypes } from '../models/game/figures/Figure-types';
import { Pawn } from '../models/game/figures/Pawn';
import { Move } from '../models/game/Move';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class MoveSimulatorService {
  private copyBoard!: Board;

  constructor(private injector: Injector) {}

  public isValidMove(start: Cell | null, end: Cell): boolean {
    if (!start) return false;
    const startCopy = this.copyBoard.getCell(start.x, start.y);
    const endCopy = this.copyBoard.getCell(end.x, end.y);
    const color = startCopy.getFigure()?.color;

    if (
      startCopy &&
      startCopy !== endCopy &&
      startCopy.getFigure()?.canMove(this.copyBoard, startCopy, endCopy)
    ) {
      const gameService = this.injector.get(GameService);
      const figure = startCopy.getFigure();
      const king = color && this.copyBoard.getKing(color);

      if (figure) {
        const targetFigure = endCopy.getFigure();

        if (targetFigure?.type !== FigureTypes.KING) {
          const boardSnap = this.copyBoard.getCopy();

          endCopy.setFigure(figure);
          startCopy.setFigure(null);
          const isValid =
            !king || !gameService.isKingUderCheck(this.copyBoard, king);
          this.setCopyBoard(boardSnap);

          return isValid;
        }
      }
    }
    return false;
  }

  public setCopyBoard(board: Board): void {
    this.copyBoard = board.getCopy();
  }
}
