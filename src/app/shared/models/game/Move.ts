import { Cell } from './Cell';
import { Figure } from './figures/Figure';
import { Player } from './Player';

export class Move {
  private movedFigure: Figure | null;
  private capturedFigure: Figure | null;
  private castlingMove: boolean = false;

  constructor(private player: Player, private start: Cell, private end: Cell) {
    this.movedFigure = start.getFigure();
    this.capturedFigure = end.getFigure();
  }

  public isCastlingMove(): boolean {
    return this.castlingMove;
  }

  public setCastlingMove(castlingMove: boolean): void {
    this.castlingMove = castlingMove;
  }
}
