import { CellChecker } from 'src/app/shared/utils/cell-checker';
import { Board } from '../Board';
import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class Rook extends Figure {
  constructor(color: Colors) {
    super(color);
    this.type = FigureTypes.ROOK;
    this.color = color;
    this.imgSrc = `./assets/images/figures/rook-${color}.png`;
  }

  public override canMove(board: Board, start: Cell, end: Cell): boolean {
    if (!super.canMove(board, start, end)) return false;
    if (CellChecker.isHorizontalEmpty(board, start, end)) return true;
    if (CellChecker.isVerticalEmpty(board, start, end)) return true;
    return false;
  }
}
