import { Board } from '../models/game/Board';
import { Cell } from '../models/game/Cell';

export class CellChecker {
  public static isVerticalEmpty(board: Board, start: Cell, end: Cell): boolean {
    if (start.x !== end.x) return false;

    const min = Math.min(start.y, end.y);
    const max = Math.max(start.y, end.y);

    for (let i = min + 1; i < max; i++) {
      const cell = board.getCell(start.x, i);
      if (cell.getFigure()) return false;
    }
    return true;
  }

  public static isHorizontalEmpty(
    board: Board,
    start: Cell,
    end: Cell
  ): boolean {
    if (start.y !== end.y) return false;

    const min = Math.min(start.x, end.x);
    const max = Math.max(start.x, end.x);

    for (let i = min + 1; i < max; i++) {
      const cell = board.getCell(i, start.y);
      if (cell.getFigure()) return false;
    }
    return true;
  }

  public static isDiagonalEmpty(board: Board, start: Cell, end: Cell): boolean {
    const absX = Math.abs(start.x - end.x);
    const absY = Math.abs(start.y - end.y);
    if (absX !== absY) return false;

    const dy = start.y < end.y ? 1 : -1;
    const dx = start.x < end.x ? 1 : -1;

    for (let i = 1; i < absX; i++) {
      const cell = board.getCell(start.x + i * dx, start.y + i * dy);
      if (cell.getFigure()) return false;
    }
    return true;
  }
}
