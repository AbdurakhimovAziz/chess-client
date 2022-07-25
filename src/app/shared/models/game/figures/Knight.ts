import { Board } from '../Board';
import { Colors } from '../Colors';
import { Point } from '../Point';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class Knight extends Figure {
  constructor(color: Colors, x: number, y: number) {
    super(color, x, y);
    this.type = FigureTypes.KNIGHT;
    this.imgSrc = `./assets/images/figures/knight-${color}.png`;
  }

  public override canMove(board: Board, start: Point, end: Point): boolean {
    if (!super.canMove(board, start, end)) return false;

    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);

    return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
  }
}
