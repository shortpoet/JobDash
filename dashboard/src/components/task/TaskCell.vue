<template>
  <div class="task-cell">
    {{taskId}}: {{ taskName }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Task } from '../../interfaces/task.interface'

export default defineComponent({
  name: 'TaskCell',
  props: {
    task: {
      type: Object as () => Task,
      required: true
    },
    // making these props makes them reactive to edit
    taskName: {
      type: String,
      required: true
    },
    taskId: {
      type: String,
      required: true
    },
  },
  setup(props, ctx) {
    const task = ref<Task>(props.task)
    // console.log(task.value)
    return {
      task
    }
  }
})
</script>
