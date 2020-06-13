<template>
  <div class="grid">
    <div
      v-for="(point, index) in points"
      :key="point"
      :class="['cell']"
      :style="{
        backgroundColor:
          getCell(index) != null
            ? `hsla(${getCell(index).species}, 100%, ${Math.min(Math.max(getCell(index).age, 75), 25)}%, 1)`
            : 'black'
      }"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Vue from 'vue';

interface Cell {
  point: number;
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
}

@Component({
  name: 'game-component'
})
export default class GameComponent extends Vue {
  interval = 0;
  rows = 30;
  columns = 30;
  points = [...new Array(this.rows * this.columns)].map((a, i) => i);
  cells: Cell[] = [];
  allSpecies: { [index: string]: number } = {};

  getCell(index: number) {
    const cell = this.cells.find(cell => cell.point === index);
    return cell;
    // if (cell) {
    //   return cell.age;
    // }
  }

  handleKeydown(event: KeyboardEvent) {
    if (/^Arrow/.test(event.key)) {
      event.preventDefault();
    }
  }

  getIndexFor(x: number, y: number) {
    return this.isInBounds(x, y) ? y * this.rows + x : null;
  }

  getCoordFor(index: number) {
    const x = index % this.rows;
    const y = (index - x) / this.columns;
    return { x, y };
  }

  getCellAt(index: number) {
    return this.cells.find(cell => cell.point === index);
  }

  getOccupiedNeighbors(index: number) {
    const perimeter = this.getPerimeterIndices(index);
    return this.cells.filter(cell => perimeter.includes(cell.point));
  }

  getUnoccupiedNeighbors(index: number) {
    const neighbors = this.getOccupiedNeighbors(index).map(n => n.point);
    return this.getPerimeterIndices(index).filter(p => !neighbors.includes(p));
  }

  getPerimeterIndices(index: number) {
    const coord = this.getCoordFor(index);

    const up = { x: coord.x, y: coord.y - 1 };
    const down = { x: coord.x, y: coord.y + 1 };
    const left = { x: coord.x - 1, y: coord.y };
    const right = { x: coord.x + 1, y: coord.y };
    const upleft = { x: coord.x - 1, y: coord.y - 1 };
    const downright = { x: coord.x + 1, y: coord.y + 1 };
    const downleft = { x: coord.x - 1, y: coord.y + 1 };
    const upright = { x: coord.x + 1, y: coord.y - 1 };

    return [
      this.getIndexFor(upleft.x, upleft.y),
      this.getIndexFor(up.x, up.y),
      this.getIndexFor(upright.x, upright.y),
      this.getIndexFor(right.x, right.y),
      this.getIndexFor(downright.x, downright.y),
      this.getIndexFor(down.x, down.y),
      this.getIndexFor(downleft.x, downleft.y),
      this.getIndexFor(left.x, left.y)
    ].filter(p => p != null) as number[];
  }

  getFingerprint(cell: Cell) {
    return JSON.stringify(cell.props);
  }

  isInBounds(x: number, y: number) {
    return x >= 0 && x < this.columns - 1 && y > 0 && y < this.rows - 1;
  }

  destroyed() {
    window.removeEventListener('keydown', this.handleKeydown);
    clearInterval(this.interval);
  }

  created() {
    this.points.forEach((point, index) => {
      const doIt = Math.floor(Math.random() * this.rows) === 0;
      if (doIt) {
        const liveNeighborMin = Math.round(Math.random() * 8);
        const liveNeighborMax = Math.round(
          Math.max(liveNeighborMin, Math.random() * 8)
        );

        // const liveAgeMin = 0;
        const liveAgeMax = Math.round(Math.random() * 360);

        const spawnNeighborMin = 1 + Math.round(Math.random() * 7);
        const spawnNeighborMax = Math.round(
          Math.max(spawnNeighborMin, Math.random() * 8)
        );

        const aggroAttack = Math.round(Math.random() * 100);
        const aggroDefense = Math.round(Math.random() * 100);
        // const spawnAgeMin = Math.random() * 9;
        // const spawnAgeMax = Math.max(spawnAgeMin, Math.random() * 9);
        const newCell: Cell = {
          point: index,
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
            }
          }
        };
        newCell.fingerprint = this.getFingerprint(newCell);
        if (!this.allSpecies[newCell.fingerprint]) {
          this.allSpecies[newCell.fingerprint] = 1;
        }
        newCell.species = Object.keys(this.allSpecies).indexOf(newCell.fingerprint);

        this.cells.push(newCell);
      }
    });
    console.log(JSON.parse(JSON.stringify(this.cells)));
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
    const kill: Cell[] = [];
    const spawn: Cell[] = [];

    let attacks = 0;
    // console.log('interval');
    this.points.forEach((point, index) => {
      const cell = this.getCellAt(index);
      const occupiedNeighbors = this.getOccupiedNeighbors(index);
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
          kill.push(cell);
        } else {
          occupiedNeighbors.forEach(neighbor => {
            if (
              cell.fingerprint !== neighbor.fingerprint &&
              cell.props.aggro.attack > neighbor.props.aggro.defense &&
              !kill.includes(neighbor)
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
          (output, cell) => ({
            min: output.min + cell.props.spawn.neighbors.min,
            max: output.max + cell.props.spawn.neighbors.max
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
          (output, cell) => ({
            min: output.min + cell.props.live.neighbors.min,
            max: output.max + cell.props.live.neighbors.max
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
          (output, cell) => ({
            max: output.max + cell.props.live.age.max
          }),
          { max: 0 }
        );
        averageLiveAgeThreshold.max = Math.round(
          averageLiveAgeThreshold.max / occupiedNeighbors.length
        );

        const averageLiveAggroThreshold = occupiedNeighbors.reduce(
          (output, cell) => ({
            defense: output.defense + cell.props.aggro.defense,
            attack: output.attack + cell.props.aggro.attack
          }),
          { defense: 0, attack: 0 }
        );
        averageLiveAggroThreshold.defense = Math.round(
          averageLiveAggroThreshold.defense / occupiedNeighbors.length
        );
        averageLiveAggroThreshold.attack = Math.round(
          averageLiveAggroThreshold.attack / occupiedNeighbors.length
        );

        if (
          occupiedNeighbors.length >= averageSpawnNeighborThreshold.min &&
          occupiedNeighbors.length <= averageSpawnNeighborThreshold.max
        ) {
          const newCell: Cell = {
            point: index,
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
              aggro: averageLiveAggroThreshold
            }
          };
          newCell.fingerprint = this.getFingerprint(newCell);
          if (!this.allSpecies[newCell.fingerprint]) {
            this.allSpecies[newCell.fingerprint] = 1;
          }
          newCell.species = Object.keys(this.allSpecies).indexOf(newCell.fingerprint);

          spawn.push(newCell);
        }
      }
    });
    kill.forEach(cell => this.cells.splice(this.cells.indexOf(cell), 1));
    this.cells.push(...spawn);
    const livingSpecies: { [index: string]: number } = {};
    const livingDominant = {
      name: '',
      count: 0
    };
    const allDominant = {
      name: '',
      count: 0
    };
    this.cells.forEach(cell => {
      // const fingerprint = this.getFingerprint(cell);
      if (livingSpecies[cell.fingerprint]) {
        livingSpecies[cell.fingerprint] += 1;
      } else {
        livingSpecies[cell.fingerprint] = 1;
      }
      if (livingSpecies[cell.fingerprint] > livingDominant.count) {
        livingDominant.name = cell.fingerprint;
        livingDominant.count = livingSpecies[cell.fingerprint];
      }

      this.allSpecies[cell.fingerprint] = Math.max(
        this.allSpecies[cell.fingerprint] || 0,
        livingSpecies[cell.fingerprint] || 0
      );

      if (this.allSpecies[cell.fingerprint] > allDominant.count) {
        allDominant.name = cell.fingerprint;
        allDominant.count = this.allSpecies[cell.fingerprint];
      }
    });
    const allS = Object.keys(this.allSpecies);
    const livingS = Object.keys(livingSpecies);
    console.log(
      'cells',
      this.cells.length,
      'births',
      spawn.length,
      'deaths',
      kill.length,
      'attacks',
      attacks,
      '# all species',
      allS.length,
      'all time dominant',
      allS.indexOf(allDominant.name),
      allDominant.count,
      '# living species',
      livingS.length,
      'living dominant',
      allS.indexOf(livingDominant.name),
      livingDominant.count
    );
  }
}
</script>

<style lang="scss" scoped>
.grid {
  display: inline-grid;
  grid-template-columns: repeat(30, 10px [col-start]);
  grid-template-rows: repeat(30, 10px [row-start]);
  border-top: 1px solid black;
  border-left: 1px solid black;
  background: black;
}
.cell {
  border-bottom: 1px solid black;
  border-right: 1px solid black;
}
.living {
  background-color: black;
}
</style>
