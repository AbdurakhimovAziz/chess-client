import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from '../models/game/Board';
import { Cell } from '../models/game/Cell';
import { Colors } from '../models/game/Colors';
import { Figure } from '../models/game/figures/Figure';
import { FigureTypes } from '../models/game/figures/Figure-types';
import { King } from '../models/game/figures/King';
import { Pawn } from '../models/game/figures/Pawn';
import { Move } from '../models/game/Move';
import { Player } from '../models/game/Player';
import { GameViewService } from './game-view.service';
import { MoveSimulatorService } from './move-simulator.service';
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

  constructor(
    private moveService: MoveService,
    private gameViewService: GameViewService,
    private moveSimulatorService: MoveSimulatorService
  ) {
    this.restart();
    this.currentPlayerSubject = new BehaviorSubject<Player>(this.whitePlayer);
    this.currentPlayer$ = this.currentPlayerSubject.asObservable();
    this.moveService.lastMove$.subscribe((move: Move | null) => {
      this.moveSimulatorService.setCopyBoard(this.board);

      this.whiteKing?.setUnderCheck(
        this.isKingUderCheck(this.board, this.whiteKing)
      );
      this.blackKing?.setUnderCheck(
        this.isKingUderCheck(this.board, this.blackKing)
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
    this.gameViewService.setBoard(this.board);
    this.whitePlayer.clearCapturedFigures();
    this.blackPlayer.clearCapturedFigures();
    this.whiteKing = this.board.getKing(Colors.WHITE);
    this.blackKing = this.board.getKing(Colors.BLACK);
  }

  public getBoard(): Board {
    return this.board;
  }

  public handleMove(start: Cell | null, end: Cell): void {
    if (start && start !== end && end.isAvailable()) {
      this.moveFigure(start, end);
      this.gameViewService.setActiveCell(null);
    } else if (!end.isEmpty() && this.isRightTurn(end.getFigure()?.color!))
      this.gameViewService.setActiveCell(end);
  }

  public moveFigure(start: Cell, end: Cell): void {
    const figure = start.getFigure();
    if (figure) {
      const targetFigure = end.getFigure();
      if (targetFigure?.type !== FigureTypes.KING) {
        end.setFigure(figure);
        start.setFigure(null);

        if (figure instanceof Pawn) figure.setFirstMove(false);
        const move = new Move(this.getCurrentPlayer(), start, end);
        targetFigure && this.getCurrentPlayer().addCapturedFigure(targetFigure);
        this.moveService.addMove(move);
      }
    }
  }

  public isRightTurn(color: Colors): boolean {
    return color === this.getCurrentPlayer().color;
  }

  public isKingUderCheck(board: Board, king: Figure | null): boolean {
    if (!king) return false;

    const color = king.color;
    const enemyColor = color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
    const enemyCells = board.getCellsWithFigure(enemyColor);

    for (const enemyCell of enemyCells) {
      if (
        enemyCell
          .getFigure()
          ?.canMove(
            board,
            { x: enemyCell.x, y: enemyCell.y },
            { x: king.x, y: king.y }
          )
      ) {
        return true;
      }
    }

    return false;
  }
}
