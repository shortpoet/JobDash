<template>
  <!--
    * watch for nested section.section
    * will start nesting relative padding (I think)
  -->
  <section class=" board-section">
    <div class="taskboard-container">
      <BoardControls @active-board="handleActiveBoardChange" @board-type="handleBoardTypeChange" :display-properties="itemProperties" @chosen-properties="handleChosenPropertyChange"/>
      <div class="container the-board">
        <div class="columns-container">
          <div class="columns is-centered">
            <!-- column class here makes column background expand past name to fill available space except padding -->
            <!-- v-if here initially renders a blank green board -->
            <TaskBoard
              :columns="columns"
              :display-properties="displayProperties"
              @update-board="onUpdateBoard"
              @board-move="onBoardMove"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue'

import TaskBoard from './../components/board/TaskBoard.vue'
import BoardControls from '../components/board/BoardControls.vue'

import { IBoardColumn } from './../interfaces/board/board.column.interface'
import { ITask } from '../interfaces/task/task.interface'
import BoardColumn from './../components/board/BoardColumn.vue'
import { useStorage } from './../composables/useStorage'
import useBoard from './../composables/board/useBoard'
import useBoardMove from './../composables/board/useBoardMove'
import { BoardStore } from '../store/board.store'
import { sortObject, colorLog } from './../utils'
import { IBoardItem } from '../interfaces/board/board.item.interface'
import { useStore } from '../store'
import { IBoardable } from '../interfaces/board/boardable.interface'
export default defineComponent({
  name: 'TaskBoardLayout',

  components: {
    BoardColumn,
    TaskBoard,
    BoardControls
  },

  props: {
    items: {
      type: Array as () => IBoardable[],
      required: true
    },
    activeBoard: {
      type: String,
      required: true
    }
  },

  emits: ['dragstart', 'draggable', 'update-board'],

  async setup(props, ctx) {
    colorLog('task board layout', 'green', 'yellow')
    const store = useStore()
    //#region board
      const boardType = ref()
      const handleBoardTypeChange = (e) => {
        // colorLog("on board type change", "orange", "purple")
        boardType.value = e
      }
      const chosenProperties = ref([])
      const handleChosenPropertyChange = (e) => {
        // colorLog("on chosen prop change", "orange", "purple")
        chosenProperties.value = e
      }
      const itemProperties = computed(() => props.items[0] ? Object.keys(props.items[0]) : [])
      const displayProperties = computed(() => chosenProperties.value)

      const boardStore: BoardStore = store.modules['boardStore']
      const columns = ref<IBoardColumn[]>()
      // console.log(itemProperties)
      const board = await useBoard(columns, boardStore, props.items, '_id', props.activeBoard)
      const onUpdateBoard = board.onUpdateBoard
      const onBoardMove = board.onBoardMove
    //#endregion

    // this is incorrect
    // notice additional arrow function that caused bug
    // watch(
    //   () => props.taskUpdate,
    //   (value: boolean, previous: boolean) => (() => {
    //     if (value != previous) {
    //       console.log('#### task update from task board layout ####')
    //       // board.onUpdateBoard()
    //     }
    //   }),
    //   {immediate: true}
    // )
    
    // this is correct

    watch(
      () => props.items.length, 
      (value: number, previous:number) => {
          console.log(`Watch props.items.lenth function called with args:", \nvalue: ${value}, \nprevious: ${previous}`)
          onUpdateBoard(props.items)
        },
      // not sure if i want this called immediately
      // makes update function run on load
      {immediate: true}
    )

    return {
      handleChosenPropertyChange,
      itemProperties,
      chosenProperties,
      displayProperties,
      handleBoardTypeChange,
      columns,
      onUpdateBoard,
      onBoardMove
    }
  }
})
</script>

<style scoped>

</style>