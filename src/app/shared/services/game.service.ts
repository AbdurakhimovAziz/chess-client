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
import { Point } from '../models/game/Point';
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
  private enPassantPawn: Pawn | null = null;

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

      this.handleEnpassant(move);
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
      let targetFigure = end.getFigure();
      if (targetFigure?.type !== FigureTypes.KING) {
        const move = new Move(this.getCurrentPlayer(), start, end);

        if (figure instanceof Pawn) {
          figure.isFirstMove() && figure.setFirstMove(false);

          if (this.isEnpassantPossible(start, end)) {
            this.board
              .getCell(this.enPassantPawn!.x, this.enPassantPawn!.y)
              .setFigure(null);
            targetFigure = this.enPassantPawn;
            move.setCapturedFigure(targetFigure);
          }
        }

        end.setFigure(figure);
        start.setFigure(null);

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

  public handleEnpassant(move: Move | null): void {
    const figure = move?.getMoveedFigure();
    if (
      move &&
      figure?.type === FigureTypes.PAWN &&
      Math.abs(move.start.y - move.end.y) === 2
    ) {
      this.setEnpassantPawn(figure as Pawn);
    } else {
      this.setEnpassantPawn(null);
    }
  }

  public setEnpassantPawn(pawn: Pawn | null): void {
    this.enPassantPawn = pawn;
  }

  public getEnpassantPawn(): Pawn | null {
    return this.enPassantPawn;
  }

  public isEnpassantPossible(start: Point | null, end: Point): boolean {
    if (!start || !this.enPassantPawn) return false;
    const figure = this.board.getCell(start.x, start.y).getFigure();
    if (
      figure?.type === FigureTypes.PAWN &&
      this.enPassantPawn.y === start.y &&
      end.y === start.y - this.enPassantPawn?.direction &&
      end.x === this.enPassantPawn.x
    ) {
      return true;
    }

    return false;
  }
}
