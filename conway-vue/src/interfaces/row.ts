import { Column } from '@/interfaces/column';

export interface Row {
  rowId: number;
  columns: Column[];
}
