import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from '../models/game/Board';
import { Cell } from '../models/game/Cell';
import { Colors } from '../models/game/Colors';
import { Figure } from '../models/game/figures/Figure';
import { FigureTypes } from '../models/game/figures/Figure-types';
import { King } from '../models/game/figures/King';
import { Pawn } from '../models/game/figures/Pawn';
import { Rook } from '../models/game/figures/Rook';
import { Move } from '../models/game/Move';
import { Player } from '../models/game/Player';
import { Point } from '../models/game/Point';
import { GameViewService } from './game-view.service';
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
  private enPassantPawn: Pawn | null = null;

  constructor(
    private moveService: MoveService,
    private gameViewService: GameViewService
  ) {
    this.restart();
    this.currentPlayerSubject = new BehaviorSubject<Player>(this.whitePlayer);
    this.currentPlayer$ = this.currentPlayerSubject.asObservable();
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
    const move = new Move(this.getCurrentPlayer(), start, end);
    const targetFigure = this.performMove(this.board, start, end);
    targetFigure && this.getCurrentPlayer().addCapturedFigure(targetFigure);
    move.setCapturedFigure(targetFigure);
    this.moveService.addMove(move);
  }

  public performMove(board: Board, start: Cell, end: Cell): Figure | null {
    const figure = start.getFigure();
    let targetFigure = end.getFigure();

    if (this.isEnpassantPossible(start, end)) {
      board.setFigureInCell(this.enPassantPawn!.x, this.enPassantPawn!.y, null);
      targetFigure = board.getFigureByPosition(
        this.enPassantPawn!.x,
        this.enPassantPawn!.y
      );
    }

    end.setFigure(figure);
    start.setFigure(null);
    return targetFigure;
  }

  public isRightTurn(color: Colors): boolean {
    return color === this.getCurrentPlayer().color;
  }

  public isKingInCheck(board: Board, king: Figure | undefined): boolean {
    if (!king) return false;

    const color = king.color;
    const enemyColor = color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
    const enemyFigures = board.getFiguresByColor(enemyColor);

    return enemyFigures.some((figure) => {
      return figure.canMove(
        board,
        { x: figure.x, y: figure.y },
        { x: king.x, y: king.y }
      );
    });
  }

  public checkEnpassant(move: Move | null): void {
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
    const figure = this.board.getFigureByPosition(start.x, start.y);
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

  // public isCheckMate(board: Board): boolean {
  //   const king = board.getKing(this.getCurrentPlayer().color);
  //   if (this.isKingUderCheck(board, king)) {
  //     const moves = this.moveSimulatorService.getAllMoves(board);
  //     for (const move of moves) {
  //       if (
  //         move.getMoveedFigure()?.color === this.getCurrentPlayer().color &&
  //         !this.isKingUderCheck(
  //           this.moveSimulatorService.simulateMove(board, move),
  //           king
  //         )
  //       ) {
  //         return false;
  //       }
  //     }
  //     return true;
  //   }
  //   return false;
  // }
}
