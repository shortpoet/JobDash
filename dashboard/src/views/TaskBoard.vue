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

// import { Task } from './../interfaces/task.interface'
// import { useTaskStore, ITaskStore } from '../store/task.store'
// import { updateTasks, loadTasks } from '../utils'
// import  useTask from './../composables/useTask'

export default defineComponent({
  name: 'TaskBoard',

  components: {
  },

  props: {
    tasks: {
      type: Array,
      required: true
    }
  },

  async setup() {

    return {
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