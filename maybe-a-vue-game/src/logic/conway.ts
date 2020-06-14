import { Cell, CellRange } from '@/interface/cell';
import { attackCells, initializeRandomCell, mergeCells, shouldCellDie, shouldCellSpawn } from '@/logic/conway-helpers';

export default class Conway {
  private grid: Cell[][] = [];
  constructor(private rowCount: number, private columnCount: number) {
    for (let row = 0; row < rowCount; row++) {
      this.grid[row] = [];
      for (let column = 0; column < columnCount; column++) {
        this.grid[row][column] = new Cell();
        if (Math.floor(Math.random() * (rowCount + columnCount) * 2) === 0) {
          initializeRandomCell(this.grid[row][column]);
        }
      }
    }
  }
  public step() {
    console.log('step');
    const kill: Cell[] = [];
    const spawn: { cell: Cell, neighbors: Cell[] }[] = [];
    for (let row = 0; row < this.rowCount; row++) {
      for (let column = 0; column < this.columnCount; column++) {
        const cell = this.getCellAt(row, column);
        const neighbors = this.getOccupiedNeighbors(row, column);
        if (cell.age >= 0) {
          cell.age += 1;
          if (shouldCellDie(cell, neighbors)) {
            kill.push(cell);
          } else {
            kill.push(...attackCells(cell, neighbors));
          }
        } else if (shouldCellSpawn(cell, neighbors)) {
          spawn.push({ cell, neighbors });
        }
      }
    }
    let k: Cell;
    for (k of kill) {
      k.age = -1;
    }
    let s: { cell: Cell, neighbors: Cell[] };
    for (s of spawn) {
      mergeCells(s.neighbors, s.cell);
      s.cell.age = 0;
    }
  }
  private getOccupiedNeighbors(
    row: number,
    column: number
  ) {
    const perimeter = this.getPerimeterCoords(row, column);
    const neighbors: Cell[] = [];
    let p: { row: number, column: number };
    for (p of perimeter) {
      const cell = this.getCellAt(p.row, p.column);
      if (cell.age >= 0) {
        neighbors.push(cell);
      }
    }
    return neighbors;
  }
  private getPerimeterCoords(row: number, column: number) {
    const up = { row: row - 1, column: column,  };
    const down = { row: row + 1, column: column };
    const left = { row: row, column: column - 1 };
    const right = { row: row, column: column + 1 };
    const upleft = { row: row - 1, column: column - 1 };
    const downright = { row: row + 1, column: column + 1 };
    const downleft = { row: row + 1, column: column - 1 };
    const upright = { row: row - 1, column: column + 1 };

    return [upleft, up, upright, right, downright, down, downleft, left]
      .filter(this.isInBounds.bind(this));
  }
  private isInBounds({ row, column }: { row: number, column: number }) {
    return (
      row > 0 &&
      row < this.rowCount - 1 &&
      column >= 0 &&
      column < this.columnCount - 1
    );
  }
  public getCellAt(row: number, column: number) {
    return this.grid[row][column];
  }
}
