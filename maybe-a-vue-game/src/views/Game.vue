<template>
  <div class="grid">
    <div class="cell" v-for="(cell, index) in cells" :key="cell">
      {{ checkCell(index) }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import Vue from 'vue';

@Component({
  name: 'game-component'
})
export default class GameComponent extends Vue {
  rows = 30;
  columns = 30;
  cells = [...new Array(this.rows * this.columns)].map((a, i) => i);
  grid = [...new Array(this.rows)].map(() =>
    [...new Array(this.columns)].map(() => '')
  );
  player = [0, 0];

  // get cells() {
  //   const cells = this.grid.reduce((row, output) => [...output, ...row], []);
  //   console.log('cells', cells);
  //   return cells;
  // }
  checkCell(index: number) {
    /* to be implemented */
  }
  handleKeydown(event: KeyboardEvent) {
    if (/^Arrow/.test(event.key)) {
      event.preventDefault();
      // console.log('grid', this.grid);
    }
  }

  // @Watch('grid', { immediate: true, deep: true })
  // watchGrid() {
  //   console.log('grid');
  //   this.cells = this.grid.reduce((row, output) => [...output, ...row], []);
  // }
  getIndexFor(x: number, y: number) {
    return y * this.rows + x;
  }
  getPointFor(index: number) {
    /* to be implemented */
  }

  mounted() {
    window.addEventListener('keydown', this.handleKeydown);
    // this.grid[0][0] = 'X';
    // this.cells[this.getIndexFor(2, 2)] = 'X';
    // let i = 0;
    // setInterval(() => {
    //   i++;
    //   this.cells[i] = "X"
    //   // console.log(this.grid[0][i]);
    // }, 2000);
  }
}
</script>

<style lang="scss" scoped>
.grid {
  display: inline-grid;
  grid-template-columns: repeat(30, 40px [col-start]);
  grid-template-rows: repeat(30, 30px [rowl-start]);
  border-top: 1px solid black;
  border-left: 1px solid black;
}
.cell {
  border-bottom: 1px solid black;
  border-right: 1px solid black;
}
</style>
