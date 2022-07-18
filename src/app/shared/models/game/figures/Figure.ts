import { Board } from '../Board';
import { Colors } from '../Colors';
import { Point } from '../Point';
import { FigureTypes } from './Figure-types';

export abstract class Figure {
  public color: Colors;
  public type: FigureTypes;
  public imgSrc: string = '';
  public x: number;
  public y: number;

  constructor(color: Colors, x: number, y: number) {
    this.color = color;
    this.type = FigureTypes.NONE;
    this.x = x;
    this.y = y;
  }

  public canMove(board: Board, start: Point, end: Point): boolean {
    const targetFigure = board.getCell(end.x, end.y).getFigure();
    if (targetFigure?.color === this.color) return false;
    return true;
  }
}
