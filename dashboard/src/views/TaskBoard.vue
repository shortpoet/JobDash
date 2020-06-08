<template>
  <div class="task-board container">
    <div class="columns is-centered">
      <div class="column has-text-centered" v-for="column in columns" :key="column.id">
        {{ column.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { Task } from './../interfaces/task.interface'
import { useTaskStore, ITaskStore } from '../store/task.store'
import { updateTasks } from '../utils'

const loadTasks = async (): Promise<Task[]> => {
  console.log('load tasks')
  const taskStore = useTaskStore()
  if (!taskStore.getState().tasks.loaded) {
    await taskStore.fetchTasks()
  }

  return taskStore.getState().tasks.ids.reduce<Task[]>((accumulator, id) => {
    const task = taskStore.getState().tasks.all[id]
    return accumulator.concat(task)
  }, [])

}

export default defineComponent({
  name: 'TaskBoard',
  async setup() {

    const taskStore = useTaskStore()

    const allTasks = ref<Task[]>([])


    onMounted(async () => {
      allTasks.value = await loadTasks()
      console.log(allTasks.value)
      allTasks.value.forEach(task => {
        console.log(task.contact)
      })
    })

    const iTaskStore: ITaskStore = {
      taskStore: taskStore
    }

    const onUpdateTasks = async () => {
      allTasks.value = await updateTasks(iTaskStore)
    }

    return {
      allTasks,
      columns: [
        {id:'1', name: 'Column 1'},
        {id:'2', name: 'Column 2'},
        {id:'3', name: 'Column 3'},
        {id:'4', name: 'Column 4'},
        {id:'5', name: 'Column 5'},
      ]
    }
  }
})
</script>

<style scoped>

</style>