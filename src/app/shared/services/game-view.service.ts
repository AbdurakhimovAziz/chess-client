import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';
import { Cell } from '../models/game/Cell';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root',
})
export class GameViewService {
  private activeCellSubject: BehaviorSubject<Cell | null>;
  public activeCell$!: Observable<Cell | null>;

  private isDraggingSubject: BehaviorSubject<boolean>;
  public isDragging$!: Observable<boolean>;

  constructor(private gameService: GameService) {
    this.activeCellSubject = new BehaviorSubject<Cell | null>(null);
    this.activeCell$ = this.activeCellSubject
      .asObservable()
      .pipe(distinctUntilChanged());

    this.isDraggingSubject = new BehaviorSubject<boolean>(false);
    this.isDragging$ = this.isDraggingSubject.asObservable();
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
