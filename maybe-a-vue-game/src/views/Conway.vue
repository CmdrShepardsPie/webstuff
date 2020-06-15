<template>
  <div class="grid">
    <div v-for="row in rows" :key="row.rowId" class="row">
      <div
        v-for="column in row.columns"
        :key="column.columnId"
        class="column"
        :style="{
          backgroundColor:
            column.cell.age >= 0
              ? `rgb(${column.cell.props.color.red}, ${column.cell.props.color.green}, ${column.cell.props.color.blue})`
              : 'black'
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Vue from 'vue';
import { Row } from '@/interfaces/row';
import Conway from '@/logic/conway';

const rowCount = 50;
const columnCount = 50;
const conway = new Conway(rowCount, columnCount);

@Component({
  name: 'game-component'
})
export default class GameComponent extends Vue {
  timer = 0;
  rows: Row[] = [...new Array(rowCount)].map((a, row) => {
    return {
      rowId: row,
      columns: [...new Array(columnCount)].map((b, column) => ({
        rowId: row,
        columnId: column,
        cell: conway.getCellAt(row, column)
      }))
    };
  });

  destroyed() {
    clearTimeout(this.timer);
  }

  created() {
    let count = 0;
    const doLoop = () => {
      this.timer = setTimeout(() => {
        count++;
        const start = Date.now();
        conway.step();
        const end = Date.now();
        const diff = end - start;
        if (count % 10 === 0) {
          console.log('took', diff, 'ms', Math.round(1000 / diff), 'fps');
        }
        doLoop();
      }, 10);
    };
    doLoop();
  }
}
</script>

<style lang="scss" scoped>
.grid {
  display: flex;
  flex: auto;
  flex-direction: column;
  justify-content: center;
  background: #111;
  height: 100vh;
}
.row {
  display: flex;
  /*flex: auto;*/
  flex-direction: row;
  justify-content: center;
  height: 1vh;
  /*width: 50%;*/
}
.column {
  /*height: 1vh;*/
  width: 1vh;
  /*width: 1vh;*/
  /*height: 1vh;*/
}
</style>
