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
import { Row } from '@/interface/row';
import Conway from '@/logic/conway';

const rowCount = 100, columnCount = 100;
const conway = new Conway(rowCount, columnCount);

@Component({
  name: 'game-component'
})
export default class GameComponent extends Vue {
  interval = 0;
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

  handleKeydown(event: KeyboardEvent) {
    if (/^Arrow/.test(event.key)) {
      event.preventDefault();
    }
  }

  destroyed() {
    clearTimeout(this.interval);
  }

  created() {
    const doLoop = () => {
      this.interval = setTimeout(() => {
        conway.step();
        doLoop();
      }, 1);
    };
    doLoop();
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
