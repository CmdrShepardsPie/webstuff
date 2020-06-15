import { Cell } from '@/interfaces/cell';

export interface Column {
  rowId: number;
  columnId: number;
  cell: Cell | null;
}
