<template>
  <!-- 
    must use $event as variable
    @dragstart.self so that nested pickupTask doesn't trigger this event listener
  -->
  <div class="column board-column-container"
    v-for="column in columns"
    :key="column.id"
    draggable
    @dragstart.self="pickupColumn($event, column)"
    @dragover.prevent
    @dragenter.prevent
    @drop="moveItemOrColumn($event, column)"
    @update-board="onUpdateBoard"
    @board-move="onBoardMove"
  >
    <BoardColumn
      :column="column" 
      @update-board="onUpdateBoard"
      :display-properties="displayProperties"
    />  
  </div>
  <div/>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue'
import BoardColumn from './BoardColumn.vue'
import { IBoardColumn } from '../../interfaces/board/board.column.interface'
import { BoardStore } from '../../store/board.store'
import { useStore } from '../../store'
import useBoardMove from '../../composables/useBoardMove'
import { colorLog } from '../../utils'
export default defineComponent({
  name: 'TaskBoard',

  components: {
    BoardColumn
  },

  props: {
    columns: {
      type: Array as () => IBoardColumn[],
      required: true
    },
    displayProperties: {
      type: Array,
      required: true
    }
  },

  emits: ['dragstart', 'draggable', 'update-board', 'board-move'],

  async setup(props, ctx) {
    colorLog('task board', 'green', 'yellow')
    console.log(props.displayProperties)
    const boardStore: BoardStore = useStore().modules['boardStore']

    const move = useBoardMove(boardStore, ctx)
    // console.log('### task board setup ###')
    // console.log(props.columns.map(item => Object.entries(item.items).map(entry => entry[1].itemId)))
    const onBoardMove = () => ctx.emit('board-move')

    const pickupColumn = move.pickupColumn
    const moveItemOrColumn = move.moveItemOrColumn

return {
      pickupColumn,
      moveItemOrColumn,
      onBoardMove,
    }
  }
})
</script>

<style scoped>

</style>