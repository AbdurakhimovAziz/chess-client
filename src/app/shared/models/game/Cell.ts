import { Colors } from './Colors';
import { Figure } from './figures/Figure';

export class Cell {
  public readonly x: number;
  public readonly y: number;
  public readonly color: Colors;
  private figure: Figure | null;
  private available: boolean = false;

  constructor(x: number, y: number, color: Colors) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = null;
  }

  public getFigure(): Figure | null {
    return this.figure;
  }

  public setFigure(figure: Figure | null) {
    this.figure = figure;
  }
}
