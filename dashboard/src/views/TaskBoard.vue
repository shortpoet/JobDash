<template>
  <!--
    * watch for nested section.section
    * will start nesting relative padding (I think)
  -->
  <section class="section task-section">

    <div class="container task-board">
      <div class="columns-container">
        <div class="columns is-centered">
          <!-- column class here makes column background expand past name to fill available space except padding -->
          <div class="column has-text-centered task-column-container"
            v-for="column in columns"
            :key="column.id"
          >
            <TaskColumn :column="column"/>  
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div class="task-board container">
      <div class="columns is-centered">
        <div class="column has-text-centered" v-for="column in _columns" :key="column.id">
          {{ column.category }}
        </div>
      </div>
    </div>
    
  </section>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { ITaskColumn } from './../interfaces/task.column.interface'
import { Task } from '../interfaces/task.interface'
import TaskColumn from './../components/task/TaskColumn.vue'

export default defineComponent({
  name: 'TaskBoard',

  components: {
    TaskColumn
  },

  props: {
    tasks: {
      type: Array as () => Task[],
      required: true
    }
  },

  async setup(props) {
    
    const columns = ref<ITaskColumn[]>()
    const tasks = ref<Task[]>()

    tasks.value = props.tasks

    columns.value = tasks.value.map((task, i) => ({
      id: i,
      category: task.category,
      tasks: tasks.value.filter(_task => task.category == _task.category)
    }))

    // watch(
    //   () => tasks[0].value,
    //   (value: string, previous: string) => {
    //     if (value != previous) {

    //     }
    //   }
    // )
    console.log(columns.value)

    const _columns = [
      {id:'1', category: 'Column 1'},
      {id:'2', category: 'Column 2'},
      {id:'3', category: 'Column 3'},
      {id:'4', category: 'Column 4'},
      {id:'5', category: 'Column 5'},
    ]

    return {
      _columns,
      columns
    }
  }
})
</script>

<style scoped>

</style>