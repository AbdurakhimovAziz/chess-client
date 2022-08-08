import { Colors } from './Colors';
import { Figure } from './figures/Figure';

export class Player {
  private name: string;
  public readonly color: Colors;
  private capturedFigures: Figure[] = [];

  constructor(color: Colors) {
    this.color = color;
    this.name = (color === Colors.WHITE ? 'White' : 'Black') + ' player';
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public getCapturedFigures(): Figure[] {
    return this.capturedFigures;
  }

  public addCapturedFigure(figure: Figure): void {
    this.capturedFigures.push(figure);
  }

  public clearCapturedFigures(): void {
    this.capturedFigures = [];
  }
}
