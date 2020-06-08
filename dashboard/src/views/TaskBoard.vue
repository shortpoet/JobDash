<template>
  <!--
    * watch for nested section.section
    * will start nesting relative padding (I think)
  -->
  <section class="section task-section">

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


    // is this correct usage of provide/inject
    //#region tasks
      const taskStore = useTaskStore()

      const iTaskStore: ITaskStore = {
        taskStore: taskStore
      }

      const allTasks = ref<Task[]>([])

      // is this correct usage of provide/inject
      const taskUse = await useTask(iTaskStore, allTasks)

      const onUpdateTasks = taskUse.onUpdateTasks
    //#endregion


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