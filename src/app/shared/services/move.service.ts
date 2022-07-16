import { Injectable } from '@angular/core';
import { Move } from '../models/game/Move';

@Injectable({
  providedIn: 'root',
})
export class MoveService {
  private moves: Move[] = [];

  constructor() {}

  public addMove(move: Move): void {
    this.moves.push(move);
  }

  public getMoves(): Move[] {
    return this.moves;
  }

  public clearMoves(): void {
    this.moves = [];
  }
}
