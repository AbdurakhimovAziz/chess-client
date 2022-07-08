import { CellChecker } from 'src/app/shared/utils/cell-checker';
import { Board } from '../Board';
import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class Bishop extends Figure {
  constructor(color: Colors) {
    super(color);
    this.type = FigureTypes.BISHOP;
    this.color = color;
    this.imgSrc = `./assets/images/figures/bishop-${color}.png`;
  }

  public override canMove(board: Board, start: Cell, end: Cell): boolean {
    if (!super.canMove(board, start, end)) return false;
    if (CellChecker.isDiagonalEmpty(board, start, end)) return true;
    return false;
  }
}
