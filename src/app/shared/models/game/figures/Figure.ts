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

  canMove(cell: Cell): boolean {
    return true;
  }

  move(cell: Cell): void {
    //
  }
}
