import { Colors } from './Colors';
import { Figure } from './figures/Figure';

export class Player {
  public readonly color: Colors;
  private capturedFigures: Figure[] = [];

  constructor(color: Colors) {
    this.color = color;
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
