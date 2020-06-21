import { CellColor } from '@/interfaces/cell';

export interface Column {
  rowId: number;
  columnId: number;
  alive: { setting: boolean };
  color: CellColor;
}
