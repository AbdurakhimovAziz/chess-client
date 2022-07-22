import { Board } from '../Board';
import { Colors } from '../Colors';
import { Point } from '../Point';
import { Figure } from './Figure';
import { FigureTypes } from './Figure-types';

export class King extends Figure {
  private inCheck: boolean = false;
  private moved = false;

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

  public isMoved(): boolean {
    return this.moved;
  }

  public setMoved(moved: boolean): void {
    this.moved = moved;
  }

  public isCastlingPossible(board: Board, start: Point, end: Point): boolean {
    let castlingPossible = false;
    if (!this.moved) {
      for (let i = this.x - 1; i > 0; --i) {
        if (
          !board.isCellEmpty(this.y, i) ||
          board.isFieldUnderAttack(
            this.y,
            i,
            this.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE
          )
        ) {
          castlingPossible = false;
          break;
        }
        const leftRook = board.getFigureByPosition(0, this.y);
        const rightRook = board.getFigureByPosition(7, this.y);
        console.log('rook', leftRook);
        console.log('rook', rightRook);
      }
    }
    return castlingPossible;
  }
}
