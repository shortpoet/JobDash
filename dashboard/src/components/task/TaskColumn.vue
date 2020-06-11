<template>
  <div class="had-text-centered task-column-category">{{ category }}</div>
  <div class="task-cells-container">
    <div class="task-cell-container"
      v-for="task in tasks"
      :key="task._id"
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
  setup(props, ctx) {
    // const category = ref(props.column.category)
    // const tasks = ref<Task[]>(props.column.tasks.value)
    // console.log(tasks.value)
    return {
      // category,
      // tasks
    }
  }
})
</script>
