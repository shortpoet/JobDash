<template>
  <div class="task-cell">
    {{ task.name }}
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
    }
  },
  setup(props, ctx) {
    const task = ref<Task>(props.task)
    console.log(task.value)
    return {
      task
    }
  }
})
</script>
