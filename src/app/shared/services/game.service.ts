import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CastlingDirection } from '../constants';
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
import { MoveSimulatorService } from './move-simulator.service';
import { MoveService } from './move.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  //TODO: add game status
  //TODO: set players to null, instantiate only after joining the lobby
  //TODO: add game mode. If it's online then set only one player
  private board!: Board;
  private gameMode: 'online' | 'local' = 'local';
  private onlinePlayerColor: Colors | null = null;

  private currentPlayerSubject: BehaviorSubject<Player>;
  public currentPlayer$: Observable<Player>;
  private whitePlayer: Player = new Player(Colors.WHITE);
  private blackPlayer: Player = new Player(Colors.BLACK);
  private enPassantPawn: Pawn | null = null;

  constructor(
    private moveService: MoveService,
    private gameViewService: GameViewService,
    private moveSimulatorService: MoveSimulatorService,
    private wsService: WebsocketService
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

  public setPlayer(player: Player): void {
    if (player.color === Colors.WHITE) {
      this.whitePlayer = player;
    } else {
      this.blackPlayer = player;
    }
  }

  public handleMove(start: Cell | null, end: Cell): void {
    if (start && start !== end && end.isAvailable()) {
      const move = new Move(
        this.getCurrentPlayer(),
        this.board,
        new Point(start.x, start.y),
        new Point(end.x, end.y)
      );

      this.processMove(move);
      this.wsService.send('move', move);
      this.gameViewService.setActiveCell(null);
    } else if (!end.isEmpty() && this.isRightTurn(end.getFigure()?.color!))
      this.gameViewService.setActiveCell(end);
  }

  public processMove(move: Move): void {
    const start = this.board.getCell(move.start.x, move.start.y);
    const end = this.board.getCell(move.end.x, move.end.y);

    if (this.isCastlingPossible(start, end)) {
      this.performCastling(
        this.board,
        start.getFigure() as King,
        end.x < start.x ? CastlingDirection.LEFT : CastlingDirection.RIGHT
      );
      move.setCastlingMove(true);
    }

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

  public performCastling(
    board: Board,
    figure: Figure,
    castlingDirection: CastlingDirection
  ): void {
    let rook;
    const row = figure.y;
    if (castlingDirection === CastlingDirection.LEFT) {
      rook = board.getFigureByPosition(0, row);
      board.setFigureInCell(0, row, null);
      board.setFigureInCell(3, row, rook);
    } else {
      rook = board.getFigureByPosition(7, row);
      board.setFigureInCell(7, row, null);
      board.setFigureInCell(5, row, rook);
    }
  }

  public changeGameMode(
    mode: 'online' | 'local',
    onlinePlayerColor?: Colors
  ): void {
    this.gameMode = mode;
    if (mode === 'online') {
      this.onlinePlayerColor = onlinePlayerColor || null;
    }
  }

  public isRightTurn(color: Colors): boolean {
    return this.gameMode === 'local'
      ? color === this.getCurrentPlayer().color
      : color === this.onlinePlayerColor &&
          color === this.getCurrentPlayer().color;
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

  public isCastlingPossible(start: Point, end: Point): boolean {
    let castlingPossible = true;
    const figure = this.board.getFigureByPosition(start.x, start.y);
    if (
      !(figure instanceof King) ||
      figure.isMoved() ||
      figure.y !== end.y ||
      figure.isInCheck()
    )
      return false;

    const dx = Math.abs(start.x - end.x);
    const castlingDirection =
      end.x < start.x ? CastlingDirection.LEFT : CastlingDirection.RIGHT;
    const rook = this.board.getFigureByPosition(
      castlingDirection === CastlingDirection.LEFT ? 0 : 7,
      figure.y
    );

    if (dx !== 2 || !(rook instanceof Rook) || rook.isMoved()) return false;

    castlingPossible =
      castlingDirection === CastlingDirection.LEFT
        ? this.isLongCastlingPossible(figure)
        : this.isShortCastlingPossible(figure);

    return castlingPossible;
  }

  public isLongCastlingPossible(figure: King): boolean {
    for (let i = figure.x - 1; i > 0; --i) {
      if (
        !this.board.isCellEmpty(i, figure.y) ||
        this.board.isCellUnderAttack(
          { x: i, y: figure.y },
          figure.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE
        )
      ) {
        return false;
      }
    }
    return true;
  }

  public isShortCastlingPossible(figure: King): boolean {
    for (let i = figure.x + 1; i < 7; ++i) {
      if (
        !this.board.isCellEmpty(i, figure.y) ||
        this.board.isCellUnderAttack(
          { x: i, y: figure.y },
          figure.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE
        )
      ) {
        return false;
      }
    }
    return true;
  }

  public isStalemate(color: Colors): boolean {
    const figures = this.board.getFiguresByColor(color);
    const cells = this.board.getCells();

    return !figures.some((figure) => {
      return cells.some((row) =>
        row.some((cell) =>
          this.moveSimulatorService.isMoveLegal(
            this.board.getCell(figure.x, figure.y),
            cell
          )
        )
      );
    });
  }
}
