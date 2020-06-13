<template>
  <!--
    * watch for nested section.section
    * will start nesting relative padding (I think)
  -->
  <section class="section board-section">

    <div class="container the-board">
      <div class="columns-container">
        <div class="columns is-centered">
          <!-- column class here makes column background expand past name to fill available space except padding -->
          <!-- 
            must use $event as variable
            @dragstart.self so that nested pickupTask doesn't trigger this event listener
          -->

          <div class="column board-column-container"
            v-for="(column, columnIndex) in columns"
            :key="column.id"
            draggable
            @dragstart.self="pickupColumn($event, column)"
            @dragover.prevent
            @dragenter.prevent
            @drop="moveTaskOrColumn($event, column, columnIndex)"
          >
            <BoardColumn
              :column="column" 
            />  
          </div>
          
        </div>
      </div>
    </div>

    <hr />

    <!-- <div class="the-board container">
      <div class="columns is-centered">
        <div class="column has-text-centered" v-for="column in _columns" :key="column.id">
          {{ column.category }}
        </div>
      </div>
    </div> -->
    
  </section>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue'
import { IBoardColumn } from './../interfaces/board/board.column.interface'
import { Task } from '../interfaces/task/task.interface'
import BoardColumn from './../components/board/BoardColumn.vue'
import { useStorage } from './../composables/useStorage'
import useBoard from './../composables/useBoard'
import { useStore } from '../store'
import { BoardStore } from '../store/board.store'
import { sortObject } from './../utils'
import { IBoardItem } from '../interfaces/board/board.item.interface'
export default defineComponent({
  name: 'TaskBoard',

  components: {
    BoardColumn
  },

  props: {
    tasks: {
      type: Array as () => Task[],
      // type: Array,
      required: true
    }
  },

  emits: ['dragstart', 'draggable'],

  async setup(props) {

    const boardStore: BoardStore = useStore().modules['boardStore']
    const board = await useBoard(boardStore, props.tasks, '_id')

    // const boardUse = useBoard(props.tasks, '_id')

    // const board = boardUse.board

    // console.log(board)

    const columns = ref<Record<string, IBoardColumn>>()

    columns.value = board.storedBoard.value.columns

    // console.log('columns')
    // console.log(columns.value)
      
    const _columns = [
      {id:'1', category: 'Column 1'},
      {id:'2', category: 'Column 2'},
      {id:'3', category: 'Column 3'},
      {id:'4', category: 'Column 4'},
      {id:'5', category: 'Column 5'},
    ]

    return {
      _columns,
      columns
    }
  }
})
</script>

<style scoped>

</style>