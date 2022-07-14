import { CellChecker } from 'src/app/shared/utils/cell-checker';
import { Board } from '../Board';
import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class Pawn extends Figure {
  private isFirstMove: boolean = true;
  // TODO: implement en passant move

  constructor(color: Colors) {
    super(color);
    this.type = FigureTypes.PAWN;
    this.color = color;
    this.imgSrc = `./assets/images/figures/pawn-${color}.png`;
  }

  public override canMove(board: Board, start: Cell, end: Cell): boolean {
    if (!super.canMove(board, start, end)) return false;
    const direction = this.color === Colors.BLACK ? 1 : -1;
    const firstStepDirection = this.color === Colors.BLACK ? 2 : -2;

    if (
      (end.y === start.y + direction ||
        (this.isFirstMove &&
          end.y === start.y + firstStepDirection &&
          board.isCellEmpty(end.x, end.y - direction))) &&
      end.x === start.x &&
      board.isCellEmpty(end.x, end.y)
    ) {
      return true;
    }

    if (
      end.y === start.y + direction &&
      Math.abs(end.x - start.x) === 1 &&
      CellChecker.areEnemies(start, end)
    ) {
      return true;
    }

    return false;
  }

  public override move(target: Cell): void {
    super.move(target);
    this.isFirstMove = false;
  }
}
