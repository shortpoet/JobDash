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
    @drop="moveItemOrColumn($event, column.category)"
    @update-board="onUpdateBoard"
  >
    <BoardColumn
      :column="column" 
      @update-board="onUpdateBoard"
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
export default defineComponent({
  name: 'TaskBoard',

  components: {
    BoardColumn
  },

  props: {
    columns: {
      type: Array as () => IBoardColumn[],
      required: true
    }
  },

  emits: ['dragstart', 'draggable', 'update-board'],

  async setup(props, ctx) {

    const boardStore: BoardStore = useStore().modules['boardStore']

    const move = useBoardMove(boardStore, ctx)
    console.log('### task board setup ###')
    // console.log(props.columns.map(item => Object.entries(item.items).map(entry => entry[1].itemId)))

    const pickupColumn = move.pickupColumn
    const moveItemOrColumn = move.moveItemOrColumn

    return {
      pickupColumn,
      moveItemOrColumn,
    }
  }
})
</script>

<style scoped>

</style>