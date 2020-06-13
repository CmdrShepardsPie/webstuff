<template>
  <div class="grid">
    <div v-for="row in rows" :key="row.rowId" class="row">
      <div
        v-for="column in row.columns"
        :key="column.columnId"
        class="column"
        :style="{
          backgroundColor:
            column.cell != null
              ? `rgb(${column.cell.props.color.red}, ${column.cell.props.color.green}, ${column.cell.props.color.blue})`
              : 'black'
        }"
      ></div>
    </div>
    <!--    <div-->
    <!--      v-for="(point, index) in points"-->
    <!--      :key="point"-->
    <!--      :class="['cell']"-->
    <!--      :style="{-->
    <!--        backgroundColor:-->
    <!--          getCell(index) != null-->
    <!--            ? `hsla(${getCell(index).species}, 100%, ${Math.min(-->
    <!--                Math.max(getCell(index).age, 75),-->
    <!--                25-->
    <!--              )}%, 1)`-->
    <!--            : 'black'-->
    <!--      }"-->
    <!--    ></div>-->
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Vue from 'vue';

interface Cell {
  // point: number;
  age: number;
  fingerprint: string;
  species: number;
  props: CellProperties;
}

interface CellProperties {
  live: {
    neighbors: {
      min: number;
      max: number;
    };
    age: {
      // min: number;
      max: number;
    };
  };
  spawn: {
    neighbors: {
      min: number;
      max: number;
    };
    // age: {
    //   min: number;
    //   max: number;
    // };
  };
  aggro: {
    attack: number;
    defense: number;
  };
  color: {
    red: number;
    green: number;
    blue: number;
  };
}

interface Row {
  rowId: number;
  columns: Column[];
}

interface Column {
  rowId: number;
  columnId: number;
  cell: Cell | null;
}

@Component({
  name: 'game-component'
})
export default class GameComponent extends Vue {
  interval = 0;
  rowCount = 100;
  columnCount = 100;
  // points = [...new Array(this.rows * this.columns)].map((a, i) => i);
  // cells: Cell[] = [];
  rows: Row[] = [...new Array(this.rowCount)].map((a, i) => {
    return {
      rowId: i,
      columns: [...new Array(this.columnCount)].map((b, column) => ({
        rowId: i,
        columnId: column,
        cell: null
      }))
    };
  });

  // allSpecies: { [index: string]: number } = {};

  // getCell(index: number) {
  //   const cell = this.cells.find(cell => cell.point === index);
  //   return cell;
  //   // if (cell) {
  //   //   return cell.age;
  //   // }
  // }

  handleKeydown(event: KeyboardEvent) {
    if (/^Arrow/.test(event.key)) {
      event.preventDefault();
    }
  }

  // getIndexFor(column: number, row: number) {
  //   return this.isInBounds(column, row) ? row * this.rows + column : null;
  // }

  // getCoordFor(index: number) {
  //   const column = index % this.rows;
  //   const row = (index - column) / this.columns;
  //   return { column, row };
  // }

  // getCellAt(index: number) {
  //   return this.cells.find(cell => cell.point === index);
  // }

  getOccupiedNeighbors(
    column: number,
    row: number
  ): (Column & { cell: Cell })[] {
    const perimeter = this.getPerimeterCoords(column, row);
    return perimeter
      .map(p => this.rows[p.row].columns[p.column])
      .filter(p => p.cell != null) as (Column & { cell: Cell })[];
  }

  getUnoccupiedNeighbors(
    column: number,
    row: number
  ): (Column & { cell: null })[] {
    const perimeter = this.getPerimeterCoords(column, row);
    return perimeter
      .map(p => this.rows[p.row].columns[p.column])
      .filter(p => p.cell == null) as (Column & { cell: null })[];
  }

  getPerimeterCoords(column: number, row: number) {
    const up = { column: column, row: row - 1 };
    const down = { column: column, row: row + 1 };
    const left = { column: column - 1, row: row };
    const right = { column: column + 1, row: row };
    const upleft = { column: column - 1, row: row - 1 };
    const downright = { column: column + 1, row: row + 1 };
    const downleft = { column: column - 1, row: row + 1 };
    const upright = { column: column + 1, row: row - 1 };

    return [upleft, up, upright, right, downright, down, downleft, left].filter(b => this.isInBounds(b.column, b.row));
  }
  // getOccupiedNeighbors(index: number) {
  //   const perimeter = this.getPerimeterIndices(index);
  //   return this.cells.filter(cell => perimeter.includes(cell.point));
  // }
  //
  // getUnoccupiedNeighbors(index: number) {
  //   const neighbors = this.getOccupiedNeighbors(index).map(n => n.point);
  //   return this.getPerimeterIndices(index).filter(p => !neighbors.includes(p));
  // }
  // getPerimeterIndices(index: number) {
  //   const coordinate = this.getCoordFor(index);
  //
  //   const up = { column: coordinate.column, row: coordinate.row - 1 };
  //   const down = { column: coordinate.column, row: coordinate.row + 1 };
  //   const left = { column: coordinate.column - 1, row: coordinate.row };
  //   const right = { column: coordinate.column + 1, row: coordinate.row };
  //   const upleft = { column: coordinate.column - 1, row: coordinate.row - 1 };
  //   const downright = { column: coordinate.column + 1, row: coordinate.row + 1 };
  //   const downleft = { column: coordinate.column - 1, row: coordinate.row + 1 };
  //   const upright = { column: coordinate.column + 1, row: coordinate.row - 1 };
  //
  //   return [
  //     this.getIndexFor(upleft.column, upleft.row),
  //     this.getIndexFor(up.column, up.row),
  //     this.getIndexFor(upright.column, upright.row),
  //     this.getIndexFor(right.column, right.row),
  //     this.getIndexFor(downright.column, downright.row),
  //     this.getIndexFor(down.column, down.row),
  //     this.getIndexFor(downleft.column, downleft.row),
  //     this.getIndexFor(left.column, left.row)
  //   ].filter(p => p != null) as number[];
  // }

  getFingerprint(cell: Cell) {
    return JSON.stringify(cell.props);
  }

  isInBounds(column: number, row: number) {
    return (
      column >= 0 &&
      column < this.columnCount - 1 &&
      row > 0 &&
      row < this.rowCount - 1
    );
  }

  destroyed() {
    window.removeEventListener('keydown', this.handleKeydown);
    clearInterval(this.interval);
  }

  created() {
    this.rows.forEach(row => {
      row.columns.forEach(column => {
        const doIt = Math.round(Math.random() * this.rowCount) === 0;
        if (doIt) {
          const liveNeighborMin = Math.round(Math.random() * 8);
          const liveNeighborMax = Math.round(
            Math.max(liveNeighborMin, Math.random() * 8)
          );

          // const liveAgeMin = 0;
          const liveAgeMax = Math.round(Math.random() * 360);

          const spawnNeighborMin = Math.round(Math.random() * 8);
          const spawnNeighborMax = Math.round(
            Math.max(spawnNeighborMin, Math.random() * 8)
          );

          const aggroAttack = Math.round(Math.random() * 100);
          const aggroDefense = Math.round(Math.random() * 100);

          const colorRed = Math.round(Math.random() * 255);
          const colorGreen = Math.round(Math.random() * 255);
          const colorBlue = Math.round(Math.random() * 255);
          // const spawnAgeMin = Math.random() * 9;
          // const spawnAgeMax = Math.max(spawnAgeMin, Math.random() * 9);
          const newCell: Cell = {
            // point: index,
            age: 0,
            species: -1,
            fingerprint: '',
            props: {
              live: {
                neighbors: {
                  min: liveNeighborMin,
                  max: liveNeighborMax
                },
                age: {
                  // min: 0,
                  max: liveAgeMax
                }
              },
              spawn: {
                neighbors: {
                  min: spawnNeighborMin,
                  max: spawnNeighborMax
                }
                // age: {
                //   min: spawnAgeMin,
                //   max: spawnAgeMax
                // }
              },
              aggro: {
                attack: aggroAttack,
                defense: aggroDefense
              },
              color: {
                red: colorRed,
                green: colorGreen,
                blue: colorBlue
              }
            }
          };
          newCell.fingerprint = this.getFingerprint(newCell);
          // if (!this.allSpecies[newCell.fingerprint]) {
          //   this.allSpecies[newCell.fingerprint] = 1;
          // }
          // newCell.species = Object.keys(this.allSpecies).indexOf(
          //   newCell.fingerprint
          // );
          column.cell = newCell;
          // this.cells.push(newCell);
        }
      });
    });
    // console.log(JSON.parse(JSON.stringify(this.cells)));
    // console.log('created');
    window.addEventListener('keydown', this.handleKeydown);
    // const count = 0;
    // const doLoop = () => {
    this.interval = setInterval(() => {
      this.gameLoop();
    }, 10);
    // doLoop();
  }

  gameLoop() {
    const kill: Column[] = [];
    const spawn: Column[] = [];

    let attacks = 0;
    // console.log('interval');
    this.rows.forEach((row, rowIndex) => {
      row.columns.forEach((column, columnIndex) => {
        const cell = column.cell;
        const occupiedNeighbors = this.getOccupiedNeighbors(
          columnIndex,
          rowIndex
        );
        if (cell || occupiedNeighbors.length > 0) {
          // debugger;
        }
        if (cell) {
          cell.age += 1;
          if (
            occupiedNeighbors.length < cell.props.live.neighbors.min ||
            occupiedNeighbors.length > cell.props.live.neighbors.max ||
            cell.age > cell.props.live.age.max
          ) {
            kill.push(column);
          } else {
            occupiedNeighbors.forEach(neighbor => {
              const neighborCell = neighbor.cell;
              if (
                cell.fingerprint !== neighborCell.fingerprint &&
                cell.props.aggro.attack > neighborCell.props.aggro.defense
              ) {
                kill.push(neighbor);
                attacks += 1;
                // console.log(cellFingerprint, 'attacked', neighborFingerprint);
              }
            });
          }
        } else {
          // no cell
          const averageSpawnNeighborThreshold = occupiedNeighbors.reduce(
            (output, neighbor) => ({
              min: output.min + neighbor.cell.props.spawn.neighbors.min,
              max: output.max + neighbor.cell.props.spawn.neighbors.max
            }),
            { min: 0, max: 0 }
          );
          averageSpawnNeighborThreshold.min = Math.round(
            averageSpawnNeighborThreshold.min / occupiedNeighbors.length
          );
          averageSpawnNeighborThreshold.max = Math.round(
            averageSpawnNeighborThreshold.max / occupiedNeighbors.length
          );

          // const averageSpawnAgeThreshold = occupiedNeighbors.reduce(
          //   (output, cell) => ({
          //     min: output.min + cell.props.spawn.age.min,
          //     max: output.max + cell.props.spawn.age.max
          //   }),
          //   { min: 0, max: 0 }
          // );
          // averageSpawnAgeThreshold.min =
          //   averageSpawnAgeThreshold.min / occupiedNeighbors.length;
          // averageSpawnAgeThreshold.max =
          //   averageSpawnAgeThreshold.max / occupiedNeighbors.length;

          const averageLiveNeighborThreshold = occupiedNeighbors.reduce(
            (output, neighbor) => ({
              min: output.min + neighbor.cell.props.live.neighbors.min,
              max: output.max + neighbor.cell.props.live.neighbors.max
            }),
            { min: 0, max: 0 }
          );
          averageLiveNeighborThreshold.min = Math.round(
            averageLiveNeighborThreshold.min / occupiedNeighbors.length
          );
          averageLiveNeighborThreshold.max = Math.round(
            averageLiveNeighborThreshold.max / occupiedNeighbors.length
          );

          const averageLiveAgeThreshold = occupiedNeighbors.reduce(
            (output, neighbor) => ({
              max: output.max + neighbor.cell.props.live.age.max
            }),
            { max: 0 }
          );
          averageLiveAgeThreshold.max = Math.round(
            averageLiveAgeThreshold.max / occupiedNeighbors.length
          );

          const averageLiveAggroThreshold = occupiedNeighbors.reduce(
            (output, neighbor) => ({
              defense: output.defense + neighbor.cell.props.aggro.defense,
              attack: output.attack + neighbor.cell.props.aggro.attack
            }),
            { defense: 0, attack: 0 }
          );
          averageLiveAggroThreshold.defense = Math.round(
            averageLiveAggroThreshold.defense / occupiedNeighbors.length
          );
          averageLiveAggroThreshold.attack = Math.round(
            averageLiveAggroThreshold.attack / occupiedNeighbors.length
          );

          const averageColorThreshold = occupiedNeighbors.reduce(
            (output, neighbor) => ({
              red: output.red + neighbor.cell.props.color.red,
              green: output.green + neighbor.cell.props.color.green,
              blue: output.blue + neighbor.cell.props.color.blue,
            }),
            { red: 0, green: 0, blue: 0 }
          );
          averageColorThreshold.red = Math.round(
            averageColorThreshold.red / occupiedNeighbors.length
          );
          averageColorThreshold.green = Math.round(
            averageColorThreshold.green / occupiedNeighbors.length
          );
          averageColorThreshold.blue = Math.round(
            averageColorThreshold.blue / occupiedNeighbors.length
          );

          if (
            occupiedNeighbors.length >= averageSpawnNeighborThreshold.min &&
            occupiedNeighbors.length <= averageSpawnNeighborThreshold.max
          ) {
            const newCell: Cell = {
              // point: index,
              age: 0,
              species: -1,
              fingerprint: '',
              props: {
                live: {
                  neighbors: averageLiveNeighborThreshold,
                  age: averageLiveAgeThreshold
                },
                spawn: {
                  neighbors: averageSpawnNeighborThreshold
                  // age: averageSpawnAgeThreshold
                },
                aggro: averageLiveAggroThreshold,
                color: averageColorThreshold
              }
            };
            newCell.fingerprint = this.getFingerprint(newCell);
            // if (!this.allSpecies[newCell.fingerprint]) {
            //   this.allSpecies[newCell.fingerprint] = 1;
            // }
            // newCell.species = Object.keys(this.allSpecies).indexOf(
            //   newCell.fingerprint
            // );

            spawn.push({ ...column, cell: newCell });
          }
        }
      });
    });
    kill.forEach(kill => (kill.cell = null));
    spawn.forEach(
      spawn =>
        (this.rows[spawn.rowId].columns[spawn.columnId].cell = spawn.cell)
    );
    const livingSpecies: { [index: string]: number } = {};
    const livingDominant = {
      name: '',
      count: 0
    };
    const allDominant = {
      name: '',
      count: 0
    };
    // this.cells.forEach(cell => {
    //   // const fingerprint = this.getFingerprint(cell);
    //   if (livingSpecies[cell.fingerprint]) {
    //     livingSpecies[cell.fingerprint] += 1;
    //   } else {
    //     livingSpecies[cell.fingerprint] = 1;
    //   }
    //   if (livingSpecies[cell.fingerprint] > livingDominant.count) {
    //     livingDominant.name = cell.fingerprint;
    //     livingDominant.count = livingSpecies[cell.fingerprint];
    //   }
    //
    //   this.allSpecies[cell.fingerprint] = Math.max(
    //     this.allSpecies[cell.fingerprint] || 0,
    //     livingSpecies[cell.fingerprint] || 0
    //   );
    //
    //   if (this.allSpecies[cell.fingerprint] > allDominant.count) {
    //     allDominant.name = cell.fingerprint;
    //     allDominant.count = this.allSpecies[cell.fingerprint];
    //   }
    // });
    // const allS = Object.keys(this.allSpecies);
    const livingS = Object.keys(livingSpecies);
    console.log(
      // 'cells',
      // this.cells.length,
      'births',
      spawn.length,
      'deaths',
      kill.length,
      'attacks',
      attacks,
      // '# all species',
      // allS.length,
      // 'all time dominant',
      // allS.indexOf(allDominant.name),
      allDominant.count,
      '# living species',
      livingS.length,
      // 'living dominant',
      // allS.indexOf(livingDominant.name),
      livingDominant.count
    );
  }
}
</script>

<style lang="scss" scoped>
.grid {
  display: inline-block;
  /*display: inline-grid;*/
  /*grid-template-columns: repeat(30, 10px [col-start]);*/
  /*grid-template-rows: repeat(30, 10px [row-start]);*/
  /*border-top: 1px solid black;*/
  /*border-left: 1px solid black;*/
  background: black;
  /*box-shadow: black 0 0 100px 100px;*/
}
.row {
  height: 5px;
}
.column {
  display: inline-block;
  width: 5px;
  height: 5px;
  /*border-bottom: 1px solid black;*/
  /*border-right: 1px solid black;*/
}
</style>
