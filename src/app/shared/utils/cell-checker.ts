import { Board } from '../models/game/Board';
import { Cell } from '../models/game/Cell';
import { Colors } from '../models/game/Colors';
import { Figure } from '../models/game/figures/Figure';
import { Point } from '../models/game/Point';

export abstract class CellChecker {
  public static isVerticalEmpty(
    board: Board,
    start: Point,
    end: Point
  ): boolean {
    if (start.x !== end.x) return false;

    const min = Math.min(start.y, end.y);
    const max = Math.max(start.y, end.y);

    for (let i = min + 1; i < max; i++) {
      const cell = board.getCell(start.x, i);
      if (!cell.isEmpty()) return false;
    }
    return true;
  }

  public static isHorizontalEmpty(
    board: Board,
    start: Point,
    end: Point
  ): boolean {
    if (start.y !== end.y) return false;

    const min = Math.min(start.x, end.x);
    const max = Math.max(start.x, end.x);

    for (let i = min + 1; i < max; i++) {
      const cell = board.getCell(i, start.y);
      if (!cell.isEmpty()) return false;
    }
    return true;
  }

  public static isDiagonalEmpty(
    board: Board,
    start: Point,
    end: Point
  ): boolean {
    const absX = Math.abs(start.x - end.x);
    const absY = Math.abs(start.y - end.y);
    if (absX !== absY) return false;

    const dy = start.y < end.y ? 1 : -1;
    const dx = start.x < end.x ? 1 : -1;

    for (let i = 1; i < absX; i++) {
      const cell = board.getCell(start.x + i * dx, start.y + i * dy);
      if (!cell.isEmpty()) return false;
    }
    return true;
  }

  public static areEnemies(cell1: Cell, cell2: Cell): boolean {
    const figure1 = cell1.getFigure();
    const figure2 = cell2.getFigure();
    return !!(figure1 && figure2 && figure1.color !== figure2.color);
  }

  public static isKingUderCheck(board: Board, king: Figure | null): boolean {
    if (!king) return false;

    const color = king.color;
    const enemyColor = color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;

    const enemyCells = board.getCellsWithFigure(enemyColor);

    for (const enemyCell of enemyCells) {
      if (
        enemyCell
          .getFigure()
          ?.canMove(
            board,
            { x: enemyCell.x, y: enemyCell.y },
            { x: king.x, y: king.y }
          )
      ) {
        return true;
      }
    }

    return false;
  }
}
