import { Cell, CellRange } from '@/interfaces/cell';

export function initializeRandomCell(cell: Cell) {
  cell.props.live.neighbors.min = Math.random() * 8;
  cell.props.live.neighbors.max = Math.max(cell.props.live.neighbors.min, Math.random() * 8);
  cell.props.live.age.max = Math.random() * 100;
  cell.props.spawn.neighbors.min = Math.random() * 8;
  cell.props.spawn.neighbors.max = Math.max(cell.props.spawn.neighbors.min, Math.random() * 8);
  cell.props.aggro.defense = Math.random() * 100;
  cell.props.aggro.attack = Math.random() * 100;
  cell.props.color.red = Math.random() * 255;
  cell.props.color.green = Math.random() * 255;
  cell.props.color.blue = Math.random() * 255;

  cell.fingerprint = JSON.stringify(cell.props);

  cell.living.age.setting = 0;
  cell.living.alive.setting = true;
}

export function mergeCells(cells: Cell[], targetCell: Cell, mutate: boolean) {
  targetCell.props.live.neighbors.min = 0;
  targetCell.props.live.neighbors.max = 0;
  targetCell.props.live.age.max = 0;
  targetCell.props.spawn.neighbors.min = 0;
  targetCell.props.spawn.neighbors.max = 0;
  targetCell.props.aggro.defense = 0;
  targetCell.props.aggro.attack = 0;
  targetCell.props.color.red = 0;
  targetCell.props.color.green = 0;
  targetCell.props.color.blue = 0;

  let merge: Cell;
  for (merge of cells) {
    targetCell.props.live.neighbors.min += merge.props.live.neighbors.min;
    targetCell.props.live.neighbors.max += merge.props.live.neighbors.max;
    targetCell.props.live.age.max += merge.props.live.age.max;
    targetCell.props.spawn.neighbors.min += merge.props.spawn.neighbors.min;
    targetCell.props.spawn.neighbors.max += merge.props.spawn.neighbors.max;
    targetCell.props.aggro.defense += merge.props.aggro.defense;
    targetCell.props.aggro.attack += merge.props.aggro.attack;
    targetCell.props.color.red += merge.props.color.red;
    targetCell.props.color.green += merge.props.color.green;
    targetCell.props.color.blue += merge.props.color.blue;
  }

  targetCell.props.live.neighbors.min /= cells.length;
  targetCell.props.live.neighbors.max /= cells.length;
  targetCell.props.live.age.max /= cells.length;
  targetCell.props.spawn.neighbors.min /= cells.length;
  targetCell.props.spawn.neighbors.max /= cells.length;
  targetCell.props.aggro.defense /= cells.length;
  targetCell.props.aggro.attack /= cells.length;
  targetCell.props.color.red /= cells.length;
  targetCell.props.color.green /= cells.length;
  targetCell.props.color.blue /= cells.length;

  if (mutate) {
    targetCell.props.live.neighbors.min += (Math.random() - Math.random()) / 10;
    targetCell.props.live.neighbors.max += (Math.random() - Math.random()) / 10;
    targetCell.props.live.age.max += (Math.random() - Math.random());
    targetCell.props.spawn.neighbors.min += (Math.random() - Math.random()) / 10;
    targetCell.props.spawn.neighbors.max += (Math.random() - Math.random()) / 10;
    targetCell.props.aggro.defense += (Math.random() - Math.random());
    targetCell.props.aggro.attack += (Math.random() - Math.random());
    targetCell.props.color.red += (Math.random() - Math.random()) * 10;
    targetCell.props.color.green += (Math.random() - Math.random()) * 10;
    targetCell.props.color.blue += (Math.random() - Math.random()) * 10;
  }
  targetCell.fingerprint = JSON.stringify(targetCell.props);

  targetCell.living.age.setting = 0;
  targetCell.living.alive.setting = true;
}

export function averageSpawnThreshold(occupiedNeighbors: Cell[]) {
  const threshold: CellRange = new CellRange();
  let cell: Cell;
  for (cell of occupiedNeighbors) {
    threshold.min += cell.props.spawn.neighbors.min;
    threshold.max += cell.props.spawn.neighbors.max;
  }
  threshold.min /= occupiedNeighbors.length;
  threshold.max /= occupiedNeighbors.length;
  return threshold;
}

export function shouldCellDie(cell: Cell, occupiedNeighbors: Cell[]) {
  return occupiedNeighbors.length < cell.props.live.neighbors.min ||
    occupiedNeighbors.length > cell.props.live.neighbors.max ||
    (cell.living.alive.setting && cell.living.age.setting > cell.props.live.age.max);
}

export function shouldCellSpawn(cell: Cell, occupiedNeighbors: Cell[]) {
  const threshold = averageSpawnThreshold(occupiedNeighbors);
  return occupiedNeighbors.length >= threshold.min &&
    occupiedNeighbors.length <= threshold.max;
}

export function attackCells(cell: Cell, occupiedNeighbors: Cell[]) {
  const attacked: Cell[] = [];
  let neighbor: Cell;
  for (neighbor of occupiedNeighbors) {
    if (cell.fingerprint !== neighbor.fingerprint &&
      cell.props.aggro.attack > neighbor.props.aggro.defense) {
      attacked.push(neighbor);
    }
  }
  return attacked;
}
