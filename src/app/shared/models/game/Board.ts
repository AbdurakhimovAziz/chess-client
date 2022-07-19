import { Cell } from './Cell';
import { Colors } from './Colors';
import { Bishop } from './figures/Bishopt';
import { Figure } from './figures/Figure';
import { King } from './figures/King';
import { Knight } from './figures/Knight';
import { Pawn } from './figures/Pawn';
import { Queen } from './figures/Queen';
import { Rook } from './figures/Rook';

export class Board {
  private cells: Cell[][] = [];
  private figures: Figure[] = [];

  public init(): void {
    this.initCells();
    this.addFigures();
  }

  private initCells() {
    for (let i = 0; i < 8; i++) {
      this.cells[i] = [];
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 0) {
          this.cells[i][j] = new Cell(j, i, Colors.WHITE);
        } else {
          this.cells[i][j] = new Cell(j, i, Colors.BLACK);
        }
      }
    }
  }

  public getCell(x: number, y: number): Cell {
    return this.cells[y][x];
  }

  public getCells(): Cell[][] {
    return this.cells;
  }

  public isCellEmpty(x: number, y: number): boolean {
    return this.getCell(x, y).isEmpty();
  }

  public addFigures(): void {
    this.addKings();
    this.addPawns();
    this.addBishops();
    this.addKnights();
    this.addRooks();
    this.addQueens();
  }

  private addFigure(figure: Figure, x: number, y: number): void {
    this.getCell(x, y).setFigure(figure);
    this.figures.push(figure);
  }

  private addKings(): void {
    this.addFigure(new King(Colors.BLACK, 4, 0), 4, 0);
    this.addFigure(new King(Colors.WHITE, 4, 7), 4, 7);
  }

  private addQueens(): void {
    this.addFigure(new Queen(Colors.BLACK, 3, 0), 3, 0);
    this.addFigure(new Queen(Colors.WHITE, 3, 7), 3, 7);
  }

  private addPawns(): void {
    for (let i = 0; i < 8; i++) {
      this.addFigure(new Pawn(Colors.BLACK, i, 1), i, 1);
      this.addFigure(new Pawn(Colors.WHITE, i, 6), i, 6);
    }
  }

  private addBishops(): void {
    this.addFigure(new Bishop(Colors.BLACK, 2, 0), 2, 0);
    this.addFigure(new Bishop(Colors.BLACK, 5, 0), 5, 0);
    this.addFigure(new Bishop(Colors.WHITE, 2, 7), 2, 7);
    this.addFigure(new Bishop(Colors.WHITE, 5, 7), 5, 7);
  }

  private addKnights(): void {
    this.addFigure(new Knight(Colors.BLACK, 1, 0), 1, 0);
    this.addFigure(new Knight(Colors.BLACK, 6, 0), 6, 0);
    this.addFigure(new Knight(Colors.WHITE, 1, 7), 1, 7);
    this.addFigure(new Knight(Colors.WHITE, 6, 7), 6, 7);
  }

  private addRooks(): void {
    this.addFigure(new Rook(Colors.BLACK, 0, 0), 0, 0);
    this.addFigure(new Rook(Colors.BLACK, 7, 0), 7, 0);
    this.addFigure(new Rook(Colors.WHITE, 0, 7), 0, 7);
    this.addFigure(new Rook(Colors.WHITE, 7, 7), 7, 7);
  }

  public getCellsWithFigure(color: Colors): Cell[] {
    return this.cells.reduce((acc, row) => {
      return acc.concat(
        row.filter(
          (cell) =>
            cell.getFigure() !== null && cell.getFigure()?.color === color
        )
      );
    }, []);
  }

  public getKing(color: Colors): King {
    return this.figures.find(
      (figure) => figure.color === color && figure instanceof King
    ) as King;
  }

  public getCopy(): Board {
    const newBoard = new Board();
    newBoard.cells = this.cells.map((row) =>
      row.map((cell) => {
        const newCell = new Cell(cell.x, cell.y, cell.color);
        newCell.setFigure(cell.getFigure());
        return newCell;
      })
    );
    newBoard.figures = [...this.figures];

    return newBoard;
  }
}
