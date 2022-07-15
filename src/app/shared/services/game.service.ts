import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from '../models/game/Board';
import { Cell } from '../models/game/Cell';
import { Colors } from '../models/game/Colors';
import { Player } from '../models/game/Player';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private board: Board = new Board();

  private currentPlayerSubject: BehaviorSubject<Player>;
  public currentPlayer$: Observable<Player>;
  private whitePlayer: Player = new Player(Colors.WHITE);
  private blackPlayer: Player = new Player(Colors.BLACK);

  constructor() {
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
    this.start();
  }

  public getBoard(): Board {
    return this.board;
  }

  public moveFigure(start: Cell, end: Cell): void {
    const figure = start.getFigure();
    if (figure) {
      figure.move(end);
      start.setFigure(null);
    }
  }

  public isRightTurn(color: Colors): boolean {
    return color === this.getCurrentPlayer().color;
  }

  private start(): void {
    this.board.init();
  }
}
