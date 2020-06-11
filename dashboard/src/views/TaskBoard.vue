<template>
  <!--
    * watch for nested section.section
    * will start nesting relative padding (I think)
  -->
  <section class="section task-section">

    <div class="box">
      <ul v-for="(item, i) in tasks" :key="i">
        <li>
        {{ item.name }}
        </li>
      </ul>
    </div>

    <div class="container task-board">
      <div class="columns-container">
        <div class="columns is-centered">
          <!-- column class here makes column background expand past name to fill available space except padding -->
          <div class="column has-text-centered task-column-container"
            v-for="column in columns"
            :key="column.id"
          >
            <TaskColumn :column="column" :category="column.category" :tasks="column.tasks"/>  
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
      // type: Array,
      required: true
    }
  },

  async setup(props) {
    
    // needs to be initialized as emtpty array
    const columns = ref<ITaskColumn[]>([])
    // const tasks = ref<Task[]>()
    // const tasks = ref([])

    // tasks.value = props.tasks

    const columnNames = ref([])


    const setColumns = () => {
      columns.value = []
      columnNames.value = []
      columnNames.value = [...new Set(props.tasks.map(task => task.category))]
      columnNames.value.forEach((category, i) => {
        const categorized = props.tasks.filter(task => task.category == category)
        const colRef = ref(categorized)
        const iTaskColumn: ITaskColumn = {
          id: i,
          category: category,
          tasks: colRef
        }
        console.log(iTaskColumn)
        console.log(columns.value)
        columns.value.push(iTaskColumn)
      })
    }

    setColumns()
    // const cols = []
    // columnNames.value.forEach((category, i) => {
    //   const colRef = ref<ITaskColumn>({
    //     id: i,
    //     category: category,
    //     tasks: tasks.value.filter(task => task.category == category)
    //   })
    //   cols.push(colRef)
    // })
  
    // columns.value = cols
    // console.log(columnNames.value)

    watch(
      () => props.tasks.length.toString(),
      (value: string, previous: string) => {
        if (value != previous) {
          setColumns()
        }
      }
    )
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