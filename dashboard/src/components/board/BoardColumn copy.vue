<template>
  <div class="had-text-centered board-column-category">{{ category }} - Order: {{ column.order }}</div>
  <div class="board-items-container">
    <div class="board-item-container"
      v-for="(task, taskIndex) in tasksMap"
      :key="task._id"
      draggable
      @dragstart="pickupTask($event, task, taskIndex, columnIndex)"
      @drag.stop="moveTaskOrColumn($event, tasks, columnIndex, taskIndex)"
    >
      <BoardItem :item="task" :item-name="task.name" :item-id="task._id"/>
    </div>
  </div>
  <div />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

import BoardItem from './BoardItem.vue'

import { IBoardColumn } from '../../interfaces/board/board.column.interface'
import { Task } from '../../interfaces/task/task.interface'

export default defineComponent({
  name: 'TaskColumn',
  components: {
    BoardItem
  },
  props: {
    category: {
      type: String,
      required: true
    },
    tasksMap: {
      // type: Object as () => Record<string, Task>,
      type: Array as () => Task[],
      required: true
    },
    column: {
      type: Object as () => IBoardColumn,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    },
    columnNames: {
      type: Array,
      required: true
    },
    // allTasks: {
    //   type: Array as () => Task[],
    //   required: true
    // }
  },

  emits: ['dragstart', 'draggable'],

  setup(props, ctx) {
    // const category = ref(props.column.category)
    // const tasks = ref<Task[]>(props.column.tasks.value)
    // console.log(tasks.value)

    const tasks = computed(() => Object.values(props.tasksMap))
    //#region drag
      const pickupTask = (e: DragEvent, task: Task, fromTaskIndex: number, fromColumnIndex: number) => {
        console.log('pickup task')

        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.dropEffect = 'move'

        e.dataTransfer.setData('task-category', task.category.toString())
        e.dataTransfer.setData('from-column-index', fromColumnIndex.toString())
        e.dataTransfer.setData('from-task-index', fromTaskIndex.toString())
        e.dataTransfer.setData('type', 'task')
      }

      const moveTask = (e: DragEvent, toColumn: Record<string, Task>, toTaskIndex: number) => {
        const fromColumnIndex = e.dataTransfer.getData('from-column-index')
        const fromTaskCategory = props.columnNames[fromColumnIndex]
        const fromTasks = tasks
        const fromTaskIndex = e.dataTransfer.getData('from-task-index')

        // this.$store.commit('MOVE_TASK', {
        //   fromTasks,
        //   fromTaskIndex,
        //   toTasks,
        //   toTaskIndex
        // })
      }
      const moveColumn = (e: DragEvent, toColumnIndex: number) => {
        const fromColumnIndex = e.dataTransfer.getData('from-column-index')

        // this.$store.commit('MOVE_COLUMN', {
        //   fromColumnIndex,
        //   toColumnIndex
        // })

      }
      const moveTaskOrColumn = (e: DragEvent, toColumn: Record<string, Task>, toColumnIndex: number, toTaskIndex: number) => {
        const type = e.dataTransfer.getData('type')

        if (type === 'task') {
          // moveTask(e, toTasks, )
        } else {
          moveColumn(e, toColumnIndex)
        }
      }

    //#endregion
    

    return {
      pickupTask,
      // category,
      tasks,
      moveTaskOrColumn
    }
  }
})
</script>
