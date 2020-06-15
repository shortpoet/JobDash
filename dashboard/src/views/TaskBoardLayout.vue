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
          <!-- v-if here initially renders a blank green board -->
          <TaskBoard :columns="columnsComputed" @update-board="onUpdateBoard"/>
        </div>
      </div>
    </div>
  </section>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue'

import TaskBoard from './../components/board/TaskBoard.vue'

import { IBoardColumn } from './../interfaces/board/board.column.interface'
import { Task } from '../interfaces/task/task.interface'
import BoardColumn from './../components/board/BoardColumn.vue'
import { useStorage } from './../composables/useStorage'
import useBoard from './../composables/useBoard'
import useBoardMove from './../composables/useBoardMove'
import { BoardStore } from '../store/board.store'
import { sortObject } from './../utils'
import { IBoardItem } from '../interfaces/board/board.item.interface'
import { useStore } from '../store'
export default defineComponent({
  name: 'TaskBoardLayout',

  components: {
    BoardColumn,
    TaskBoard
  },

  props: {
    tasks: {
      type: Array as () => Task[],
      required: true
    },
    activeBoard: {
      type: String,
      required: true
    }
  },

  emits: ['dragstart', 'draggable', 'update-board'],

  async setup(props, ctx) {
    const store = useStore()
    //#region board
      const boardStore: BoardStore = store.modules['boardStore']
      const columns = ref<IBoardColumn[]>()
      const taskRef = ref(props.tasks)
      // console.log('$$$$ task length $$$$')
      // console.log(taskLength.value)
      const tasksComputed = computed(() => taskRef.value)
      const board = await useBoard(columns, boardStore, tasksComputed.value, '_id', props.activeBoard)
      const onUpdateBoard = board.onUpdateBoard
      const columnsComputed = board.columns
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
      () => props.tasks.length, 
      (value: number, previous:number) => {
          console.log(`Watch props.tasks.lenth function called with args:", \nvalue: ${value}, \nprevious: ${previous}`)
          onUpdateBoard()
        },
      {immediate: true}
    )

    return {
      columnsComputed,
      onUpdateBoard
    }
  }
})
</script>

<style scoped>

</style>