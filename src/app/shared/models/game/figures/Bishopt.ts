import { CellChecker } from 'src/app/shared/utils/cell-checker';
import { Board } from '../Board';
import { Colors } from '../Colors';
import { Point } from '../Point';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class Bishop extends Figure {
  constructor(color: Colors, x: number, y: number) {
    super(color, x, y);
    this.type = FigureTypes.BISHOP;
    this.imgSrc = `./assets/images/figures/bishop-${color}.png`;
  }

  public override canMove(board: Board, start: Point, end: Point): boolean {
    if (!super.canMove(board, start, end)) return false;
    if (CellChecker.isDiagonalEmpty(board, start, end)) return true;
    return false;
  }
}
