import { Colors } from './Colors';
import { Figure } from './figures/Figure';
import { Move } from './Move';

export class Player {
  private name: string;
  public readonly color: Colors;
  private moves: Move[] = [];

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

  public getMoves(): Move[] {
    return this.moves;
  }

  public addMove(move: Move): void {
    this.moves.push(move);
  }
}
