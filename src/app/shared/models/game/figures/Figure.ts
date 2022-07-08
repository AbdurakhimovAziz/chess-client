import { Board } from '../Board';
import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { FigureTypes } from './Figure-types';

export abstract class Figure {
  public color: Colors;
  public type: FigureTypes;
  public imgSrc: string = '';

  constructor(color: Colors) {
    this.color = color;
    this.type = FigureTypes.NONE;
  }

  public canMove(board: Board, start: Cell, end: Cell): boolean {
    const targetFigure = end.getFigure();
    if (
      targetFigure?.color === this.color ||
      targetFigure?.type === FigureTypes.KING
    )
      return false;
    return true;
  }

  public move(target: Cell): void {
    target.setFigure(this);
  }
}
