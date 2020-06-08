<template>
  <!--
    * watch for nested section.section
    * will start nesting relative padding (I think)
  -->
  <section class="section task-section">

    <div class="columns">
      <div class="column is-one-half">
      </div>
      <div class="column is-one-half">
        <TaskTable :tasks="allTasks" @update-tasks="onUpdateTasks"/>
      </div>
    </div>

    <div class="task-board container">
      <div class="columns is-centered">
        <div class="column has-text-centered" v-for="column in columns" :key="column.id">
          {{ column.name }}
        </div>
      </div>
    </div>
    
  </section>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { Task } from './../interfaces/task.interface'
import { useTaskStore, ITaskStore } from '../store/task.store'
import { updateTasks, loadTasks } from '../utils'
import TaskTable from './../components/task/TaskTable.vue'
import  useTask from './../composables/useTask'

export default defineComponent({
  name: 'TaskBoard',

  components: {
    TaskTable
  },

  props: {
    tasks: {
      type: Array,
      required: true
    }
  },

  async setup() {

    // const taskStore = useTaskStore()

    // const allTasks = ref<Task[]>([])

    // const { onUpdateTasks } = await useTask(allTasks)

    // onMounted(async () => {
    //   allTasks.value = await loadTasks()
    //   console.log(allTasks.value)
    //   allTasks.value.forEach(task => {
    //     console.log(task.contact)
    //   })
    // })

    const allTasks = ref<Task[]>([])

    // is this correct usage of provide/inject
    const taskUse = await useTask(allTasks)

    const onUpdateTasks = taskUse.onUpdateTasks


    return {
      allTasks,
      columns: [
        {id:'1', name: 'Column 1'},
        {id:'2', name: 'Column 2'},
        {id:'3', name: 'Column 3'},
        {id:'4', name: 'Column 4'},
        {id:'5', name: 'Column 5'},
      ],
      onUpdateTasks
    }
  }
})
</script>

<style scoped>

</style>