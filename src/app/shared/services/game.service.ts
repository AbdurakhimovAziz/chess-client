import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from '../models/game/Board';
import { Cell } from '../models/game/Cell';
import { Colors } from '../models/game/Colors';
import { Figure } from '../models/game/figures/Figure';
import { King } from '../models/game/figures/King';
import { Pawn } from '../models/game/figures/Pawn';
import { Move } from '../models/game/Move';
import { Player } from '../models/game/Player';
import { CellChecker } from '../utils/cell-checker';
import { MoveService } from './move.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private board!: Board;

  private currentPlayerSubject: BehaviorSubject<Player>;
  public currentPlayer$: Observable<Player>;
  private whitePlayer: Player = new Player(Colors.WHITE);
  private blackPlayer: Player = new Player(Colors.BLACK);
  private whiteKing: King | null = null;
  private blackKing: King | null = null;

  constructor(private moveService: MoveService) {
    this.currentPlayerSubject = new BehaviorSubject<Player>(this.whitePlayer);
    this.currentPlayer$ = this.currentPlayerSubject.asObservable();
    this.moveService.lastMove$.subscribe((move: Move | null) => {
      this.whiteKing?.setUnderCheck(
        CellChecker.isKingUderCheck(this.board, this.whiteKing)
      );
      this.blackKing?.setUnderCheck(
        CellChecker.isKingUderCheck(this.board, this.blackKing)
      );
    });
  }

  public getCurrentPlayer(): Player {
    return this.currentPlayerSubject.getValue();
  }

  public setCurrentPlayer(player: Player): void {
    this.currentPlayerSubject.next(player);
  }

  public swapCurrentPlayer(): void {
    const currentPlayer = this.getCurrentPlayer();
    this.setCurrentPlayer(
      currentPlayer === this.whitePlayer ? this.blackPlayer : this.whitePlayer
    );
  }

  public restart(): void {
    this.board = new Board();
    this.board.init();
    this.whitePlayer.clearCapturedFigures();
    this.blackPlayer.clearCapturedFigures();
    this.whiteKing = this.board.getKing(Colors.WHITE);
    this.blackKing = this.board.getKing(Colors.BLACK);
  }

  public getBoard(): Board {
    return this.board;
  }

  public moveFigure(start: Cell, end: Cell): void {
    const figure = start.getFigure();
    if (figure) {
      const move = new Move(this.getCurrentPlayer(), start, end);
      const targetFigure = end.getFigure();

      targetFigure && this.getCurrentPlayer().addCapturedFigure(targetFigure);

      end.setFigure(figure);
      start.setFigure(null);

      if (figure instanceof Pawn) figure.setFirstMove(false);
      this.moveService.addMove(move);
    }
  }

  public isRightTurn(color: Colors): boolean {
    return color === this.getCurrentPlayer().color;
  }
}
