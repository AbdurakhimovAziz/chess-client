import { Board } from '../Board';
import { Colors } from '../Colors';
import { Point } from '../Point';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class King extends Figure {
  private inCheck: boolean = false;

  // TODO: implement castling
  constructor(color: Colors, x: number, y: number) {
    super(color, x, y);
    this.type = FigureTypes.KING;
    this.imgSrc = `./assets/images/figures/king-${color}.png`;
  }

  public override canMove(board: Board, start: Point, end: Point): boolean {
    if (!super.canMove(board, start, end)) return false;

    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);

    return (
      (dx === 1 && dy === 1) || (dx === 0 && dy === 1) || (dx === 1 && dy === 0)
    );
  }

  public isInCheck(): boolean {
    return this.inCheck;
  }

  public setInCheck(checked: boolean): void {
    this.inCheck = checked;
  }
}
