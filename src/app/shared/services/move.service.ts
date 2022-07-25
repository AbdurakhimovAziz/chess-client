import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Move } from '../models/game/Move';

@Injectable({
  providedIn: 'root',
})
export class MoveService {
  private moves: Move[] = [];
  private lastMoveSubject: Subject<Move>;
  public lastMove$: Observable<Move>;

  constructor() {
    this.lastMoveSubject = new Subject<Move>();
    this.lastMove$ = this.lastMoveSubject.asObservable();
  }

  public addMove(move: Move): void {
    this.lastMoveSubject.next(move);
    this.moves.push(move);
  }

  public getMoves(): Move[] {
    return this.moves;
  }

  public clearMoves(): void {
    this.moves = [];
  }
}
