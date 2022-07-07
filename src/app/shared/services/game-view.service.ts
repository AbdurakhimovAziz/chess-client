import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from '../models/game/Board';
import { Cell } from '../models/game/Cell';

@Injectable({
  providedIn: 'root',
})
export class GameViewService {
  private activeCellSubject: BehaviorSubject<Cell | null>;
  public activeCell$!: Observable<Cell | null>;

  constructor() {
    this.activeCellSubject = new BehaviorSubject<Cell | null>(null);
    this.activeCell$ = this.activeCellSubject.asObservable();
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
