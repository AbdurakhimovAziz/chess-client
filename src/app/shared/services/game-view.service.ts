import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';
import { Board } from '../models/game/Board';
import { Cell } from '../models/game/Cell';

@Injectable({
  providedIn: 'root',
})
export class GameViewService {
  private board!: Board;

  private activeCellSubject: BehaviorSubject<Cell | null>;
  public activeCell$!: Observable<Cell | null>;

  private isDraggingSubject: BehaviorSubject<boolean>;
  public isDragging$!: Observable<boolean>;

  constructor() {
    this.activeCellSubject = new BehaviorSubject<Cell | null>(null);
    this.activeCell$ = this.activeCellSubject
      .asObservable()
      .pipe(distinctUntilChanged());

    this.isDraggingSubject = new BehaviorSubject<boolean>(false);
    this.isDragging$ = this.isDraggingSubject.asObservable();
  }

  public highlightCells(selectedCell: Cell | null): void {
    const board = this.board;
    const cells = board.getCells();
    for (let row of cells) {
      for (let cell of row) {
        // TODO: check if move doesn't put king in check
        cell.setAvailable(
          !!selectedCell?.getFigure()?.canMove(board, selectedCell, cell)
        );
      }
    }
  }

  public getBoard(): Board {
    return this.board;
  }

  public setBoard(board: Board): void {
    this.board = board;
  }

  public setActiveCell(cell: Cell | null): void {
    if (cell === this.getActiveCell() && !this.getIsDragging())
      this.activeCellSubject.next(null);
    else this.activeCellSubject.next(cell);
  }

  public getActiveCell(): Cell | null {
    return this.activeCellSubject.getValue();
  }

  public setIsDragging(isDragging: boolean): void {
    this.isDraggingSubject.next(isDragging);
  }

  public getIsDragging(): boolean {
    return this.isDraggingSubject.getValue();
  }
}
