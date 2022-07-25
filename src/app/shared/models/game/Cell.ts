import { Colors } from './Colors';
import { Figure } from './figures/Figure';
import { King } from './figures/King';

export class Cell {
  public readonly x: number;
  public readonly y: number;
  public readonly color: Colors;
  private available: boolean = false;
  private figure: Figure | null;

  constructor(x: number, y: number, color: Colors) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = null;
  }

  public isAvailable(): boolean {
    return this.available;
  }

  public setAvailable(available: boolean) {
    this.available = available;
  }

  public getFigure(): Figure | null {
    return this.figure;
  }

  public setFigure(figure: Figure | null) {
    this.figure = figure;
    if (this.figure) {
      this.figure.x = this.x;
      this.figure.y = this.y;
    }
  }

  public isEmpty(): boolean {
    return this.figure === null;
  }
}
