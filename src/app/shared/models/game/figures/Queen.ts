import { CellChecker } from 'src/app/shared/utils/cell-checker';
import { Board } from '../Board';
import { Colors } from '../Colors';
import { Point } from '../Point';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class Queen extends Figure {
  constructor(color: Colors, x: number, y: number) {
    super(color, x, y);
    this.type = FigureTypes.QUEEN;
    this.imgSrc = `./assets/images/figures/queen-${color}.png`;
  }

  public override canMove(board: Board, start: Point, end: Point): boolean {
    if (!super.canMove(board, start, end)) return false;
    if (
      CellChecker.isVerticalEmpty(board, start, end) ||
      CellChecker.isHorizontalEmpty(board, start, end) ||
      CellChecker.isDiagonalEmpty(board, start, end)
    )
      return true;
    return false;
  }
}
