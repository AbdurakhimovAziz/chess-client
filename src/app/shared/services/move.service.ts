import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Move } from '../models/game/Move';

@Injectable({
  providedIn: 'root',
})
export class MoveService {
  private moves: Move[] = [];
  private lastMoveSubject: BehaviorSubject<Move | null>;
  public lastMove$: Observable<Move | null>;

  constructor() {
    this.lastMoveSubject = new BehaviorSubject<Move | null>(null);
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
