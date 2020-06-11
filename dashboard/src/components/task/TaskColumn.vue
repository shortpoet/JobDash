<template>
  <div class="had-text-centered task-column-category">{{ category }}</div>
  <div class="task-cells-container">
    <div class="task-cell-container"
      v-for="(task, i) in tasks"
      :key="task._id"
      draggable
      @dragstart="pickupTask($event, task, i)"
    >
      <TaskCell :task="task" />
    </div>
  </div>
  <div />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TaskCell from './TaskCell.vue'
import { ITaskColumn } from '../../interfaces/task.column.interface'
import { Task } from '../../interfaces/task.interface'

export default defineComponent({
  name: 'TaskColumn',
  components: {
    TaskCell
  },
  props: {
    category: {
      type: String,
      required: true
    },
    tasks: {
      type: Array as () => Task[],
      required: true
    },
    column: {
      type: Object as () => ITaskColumn,
      required: true
    }
  },

  emits: ['dragstart', 'draggable'],

  setup(props, ctx) {
    // const category = ref(props.column.category)
    // const tasks = ref<Task[]>(props.column.tasks.value)
    // console.log(tasks.value)

    //#region drag
      const pickupTask = (e: DragEvent, task: Task, index: number) => {
        console.log('pickup task')
        console.log(e)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.dropEffect = 'move'

        e.dataTransfer.setData('task-category', task.category.toString())
        e.dataTransfer.setData('task-index', index.toString())
        console.log(e.dataTransfer.getData('task-category'))
        console.log(e.dataTransfer.getData('task-index'))
      }
    //#endregion

    return {
      pickupTask,
      // category,
      // tasks
    }
  }
})
</script>
