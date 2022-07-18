import { Board } from '../Board';
import { Colors } from '../Colors';
import { Point } from '../Point';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class King extends Figure {
  private underCheck: boolean = false;

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
    // TODO: check if move will not result a check

    return (
      (dx === 1 && dy === 1) || (dx === 0 && dy === 1) || (dx === 1 && dy === 0)
    );
  }

  public isUnderCheck(): boolean {
    return this.underCheck;
  }

  public setUnderCheck(checked: boolean): void {
    this.underCheck = checked;
  }
}
