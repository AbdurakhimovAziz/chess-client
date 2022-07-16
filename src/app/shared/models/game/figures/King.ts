import { Board } from '../Board';
import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class King extends Figure {
  // TODO: implement castling
  constructor(color: Colors) {
    super(color);
    this.type = FigureTypes.KING;
    this.imgSrc = `./assets/images/figures/king-${color}.png`;
  }

  public override canMove(board: Board, start: Cell, end: Cell): boolean {
    if (!super.canMove(board, start, end)) return false;

    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);
    // TODO: check if move will not result a check

    return (
      (dx === 1 && dy === 1) || (dx === 0 && dy === 1) || (dx === 1 && dy === 0)
    );
  }
}
