import { Map } from 'immutable';
import { Colors } from './Colors';
import { Figure } from './figures/Figure';

export class Cell {
  // public readonly x: number;
  // public readonly y: number;
  // public readonly color: Colors;
  // private available: boolean = false;
  // private figure: Figure | null;

  private _data: Map<string, any>;

  constructor(data: any) {
    this._data = Map<string, any>(data);

    // this.x = x;
    // this.y = y;
    // this.color = color;
    // this.figure = null;
  }

  get x() {
    return this._data.get('x');
  }

  get y() {
    return this._data.get('y');
  }

  get color() {
    return this._data.get('color');
  }

  public isAvailable(): boolean {
    return this._data.get('available');
    // return this.available;
  }

  public setAvailable(available: boolean) {
    return new Cell(this._data.set('available', available));
    // this.available = available;
  }

  public getFigure(): Figure | null {
    return this._data.get('figure');
    // return this.figure;
  }

  public setFigure(figure: Figure | null) {
    if (figure) {
      figure.x = this.x;
      figure.y = this.y;
    }
    const newCell = new Cell(this._data.set('figure', figure));
    return newCell;

    // this.figure = figure;
    // if (this.figure) {
    //   this.figure.x = this.x;
    //   this.figure.y = this.y;
    // }
  }

  public isEmpty(): boolean {
    return this._data.get('figure') === null;
    // return this.figure === null;
  }

  public isEqual(cell: Cell | null): boolean {
    return this.x === cell?.x && this.y === cell?.y;
  }
}
