import { pointToCoordinates } from '../../utils/move-translator';
import { Board } from './Board';
import { Figure } from './figures/Figure';
import { Player } from './Player';
import { Point } from './Point';

export class Move {
  private movedFigure: Figure | null;
  private capturedFigure: Figure | null;
  private castlingMove: boolean = false;
  public readonly boardCoords: string = '';

  constructor(
    public player: Player,
    public readonly board: Board,
    public start: Point,
    public end: Point
  ) {
    this.movedFigure = board.getFigureByPosition(start.x, start.y);
    this.capturedFigure = board.getFigureByPosition(end.x, end.y);
    this.boardCoords = pointToCoordinates(start, end);
  }

  public isCastlingMove(): boolean {
    return this.castlingMove;
  }

  public setCastlingMove(castlingMove: boolean): void {
    this.castlingMove = castlingMove;
  }

  public setCapturedFigure(figure: Figure | null): void {
    this.capturedFigure = figure;
  }

  public getMoveedFigure(): Figure | null {
    return this.movedFigure;
  }

  public getCapturedFigure(): Figure | null {
    return this.capturedFigure;
  }
}
