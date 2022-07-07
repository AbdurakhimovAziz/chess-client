import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from '../models/game/Board';
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
    const cells = this.gameService.getBoard().getCells();
    for (let row of cells) {
      for (let cell of row) {
        cell.setAvailable(!!selectedCell?.getFigure()?.canMove(cell));
      }
    }
  }

  public setActiveCell(cell: Cell | null) {
    if (cell?.getFigure()) {
      this.activeCellSubject.next(cell);
    }
  }

  public getActiveCell(): Cell | null {
    return this.activeCellSubject.getValue();
  }
}
