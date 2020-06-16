export interface Cell {
  living: CellLiving;
  fingerprint: string;
  props: CellProperties;
}

export interface CellProperties {
  live: CellLife;
  spawn: CellSpawn;
  aggro: CellAggro;
  color: CellColor;
}

export interface CellLiving {
  // Use a "setting" property within an object so that watchers can narrow down observers for performance
  age: { setting: number };
  alive: { setting: boolean };
}

export interface CellLife {
  neighbors: CellRange;
  age: CellRange;
}

export interface CellSpawn {
  neighbors: CellRange;
}

export interface CellRange {
  min: number;
  max: number;
}

export interface CellAggro {
  attack: number;
  defense: number;
}

export interface CellColor {
  red: number;
  green: number;
  blue: number;
}

export class CellRange implements CellRange {
  max = -1;
  min = -1;
  constructor(cellRange?: CellRange) {
    if (cellRange) {
      Object.assign(this, cellRange);
    }
  }
}

export class CellLiving implements CellLiving {
  age: { setting: number } = { setting: -1 };
  alive: { setting: boolean } = { setting: false };
  constructor(cellLiving?: CellLiving) {
    if (cellLiving) {
      Object.assign(this, cellLiving);
    }
  }
}

export class CellLife implements CellLife {
  age = new CellRange();
  neighbors = new CellRange();
  constructor(cellLife?: CellLife) {
    if (cellLife) {
      Object.assign(this, cellLife);
    }
  }
}

export class CellSpawn implements CellSpawn {
  neighbors = new CellRange();
  constructor(cellSpawn?: CellSpawn) {
    if (cellSpawn) {
      Object.assign(this, cellSpawn);
    }
  }
}

export class CellAggro implements CellAggro {
  attack = -1;
  defense = -1;
  constructor(cellAggro?: CellAggro) {
    if (cellAggro) {
      Object.assign(this, cellAggro);
    }
  }
}

export class CellColor implements CellColor {
  blue = -1;
  green = -1;
  red = -1;
  constructor(cellColor?: CellColor) {
    if (cellColor) {
      Object.assign(this, cellColor);
    }
  }
}

export class CellProperties implements CellProperties {
  aggro = new CellAggro();
  color = new CellColor();
  live = new CellLife();
  spawn = new CellSpawn();
  constructor(cellProperties?: CellProperties) {
    if (cellProperties) {
      Object.assign(this, cellProperties);
    }
  }
}

export class Cell implements Cell {
  fingerprint = '';
  living = new CellLiving();
  props = new CellProperties();
  constructor(cell?: Cell) {
    if (cell) {
      Object.assign(this, cell);
    }
  }
}
