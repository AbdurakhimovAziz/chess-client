import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cell } from '../models/game/Cell';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class GameViewService {
  private activeCellSubject: BehaviorSubject<Cell | null>;
  public activeCell$!: Observable<Cell | null>;

  constructor(private gameService: GameService) {
    this.activeCellSubject = new BehaviorSubject<Cell | null>(null);
    this.activeCell$ = this.activeCellSubject.asObservable();
  }

  public highlightCells(selectedCell: Cell | null): void {
    const board = this.gameService.getBoard();
    const cells = board.getCells();
    for (let row of cells) {
      for (let cell of row) {
        cell.setAvailable(
          !!selectedCell?.getFigure()?.canMove(board, selectedCell, cell)
        );
      }
    }
  }

  public setActiveCell(cell: Cell | null) {
    if (cell === this.getActiveCell()) this.activeCellSubject.next(null);
    else this.activeCellSubject.next(cell);
  }

  public getActiveCell(): Cell | null {
    return this.activeCellSubject.getValue();
  }
}
