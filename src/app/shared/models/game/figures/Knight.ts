import { Board } from '../Board';
import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class Knight extends Figure {
  constructor(color: Colors) {
    super(color);
    this.type = FigureTypes.KNIGHT;
    this.color = color;
    this.imgSrc = `./assets/images/figures/knight-${color}.png`;
  }

  public override canMove(board: Board, start: Cell, end: Cell): boolean {
    if (!super.canMove(board, start, end)) return false;
    return true;
  }
}
