import { CellChecker } from 'src/app/shared/utils/cell-checker';
import { Board } from '../Board';
import { Colors } from '../Colors';
import { Point } from '../Point';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class Rook extends Figure {
  private moved = false;

  constructor(color: Colors, x: number, y: number) {
    super(color, x, y);
    this.type = FigureTypes.ROOK;
    this.imgSrc = `./assets/images/figures/rook-${color}.png`;
  }

  public override canMove(board: Board, start: Point, end: Point): boolean {
    if (!super.canMove(board, start, end)) return false;
    if (
      CellChecker.isHorizontalEmpty(board, start, end) ||
      CellChecker.isVerticalEmpty(board, start, end)
    )
      return true;
    return false;
  }

  public isMoved(): boolean {
    return this.moved;
  }

  public setMoved(moved: boolean): void {
    this.moved = moved;
  }
}
