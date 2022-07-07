import { Injectable } from '@angular/core';
import { Board } from '../models/game/Board';

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

  private start() {
    this.board.init();
  }
}
