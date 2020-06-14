import { Cell } from '@/interface/cell';

export interface Column {
  rowId: number;
  columnId: number;
  cell: Cell | null;
}
