import { Injectable } from '@angular/core';
import { Board } from '../models/game/Board';
import { Cell } from '../models/game/Cell';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private board: Board = new Board();

  constructor() {}

  public restart() {
    this.board = new Board();
    this.start();
  }

  public getBoard(): Board {
    return this.board;
  }

  public moveFigure(start: Cell, end: Cell) {
    const figure = start.getFigure();
    if (figure) {
      figure.move(end);
      start.setFigure(null);
    }
  }

  private start() {
    this.board.init();
  }
}
