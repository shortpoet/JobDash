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
          <!-- 
            must use $event as variable
            @dragstart.self so that nested pickupTask doesn't trigger this event listener
          -->
          <div class="column task-column-container"
            v-for="(column, columnIndex) in columnsComputed"
            :key="column.id"
            draggable
            @dragstart.self="pickupColumn($event, column, columnIndex)"
            @dragover.prevent
            @dragenter.prevent
            @drop="moveTaskOrColumn($event, column.tasks, columnIndex)"
          >
            <TaskColumn
              :column="column" 
              :category="column.category"
              :tasks-map="column.tasks"
              :column-index="columnIndex"
              :column-names="columnNames"
              :all-tasks="allTasks"
            />  
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
import { defineComponent, ref, onMounted, watch, computed } from 'vue'
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

  emits: ['dragstart', 'draggable'],

  async setup(props) {

    const allTasks = ref<Task[]>(props.tasks)
    
    const columns = ref<ITaskColumn[]>([])

    const columnNames = ref([])


    const categories = computed<string[]>(() => {
      const catArr = []
      props.tasks.forEach(task => {
        if (!catArr.includes(task.category)) {
          catArr.push(task.category)
        }
      })
      return catArr
    })

    // const columnsComputed = computed<ITaskColumn[]>((): ITaskColumn[] => {
    //   const taskColumns: Record<string, Task[]> = {}
    //   props.tasks.forEach(task => {
    //     if (task.category in taskColumns) {
    //       taskColumns[task.category].push(task)
    //     } else {
    //       taskColumns[task.category] = []
    //       taskColumns[task.category].push(task)
    //     }
    //   })
      
    //   return Object.keys(taskColumns).map((category, i) => ({
    //     id: i,
    //     category: category,
    //     tasks: taskColumns[category]
    //   }))
    // })

    const columnsComputed = computed<ITaskColumn[]>((): ITaskColumn[] => {
      const categoryColumns: Record<string, Record<string, Task>> = {}
      // console.log(categoryColumns)
      props.tasks.forEach(task => {
        if (task) {
          if (task.category in categoryColumns) {
            categoryColumns[task.category][task._id] = task
          }else {
            categoryColumns[task.category] = {}
            // categoryColumns[task.category][task._id] = <Task>{}
            categoryColumns[task.category][task._id] = task
          }
        }
      })
      
      const out = Object.keys(categoryColumns).map((category, i) => ({
        id: i,
        category: category,
        tasks: categoryColumns[category]
      }))
      // console.log(out)
      return out
    })

    
  

    //#region setColumns
      // const setColumns = () => {
      //   columns.value = []
      //   columnNames.value = []
      //   columnNames.value = [...new Set(props.tasks.map(task => task.category))]
      //   columnNames.value.forEach((category, i) => {
      //     const categorized = props.tasks.filter(task => task.category == category)
      //     // const colRef = ref(categorized)
      //     const iTaskColumn: ITaskColumn = {
      //       id: i,
      //       category: category,
      //       tasks: categorized
      //     }
      //     columns.value.push(iTaskColumn)
      //   })
      // }
      // // setColumns()
      // watch(
      //   () => props.tasks.length.toString(),
      //   (value: string, previous: string) => {
      //     if (value != previous) {
      //       setColumns()
      //     }
      //   },
      //   {immediate: true}
      // )

      const _columns = [
        {id:'1', category: 'Column 1'},
        {id:'2', category: 'Column 2'},
        {id:'3', category: 'Column 3'},
        {id:'4', category: 'Column 4'},
        {id:'5', category: 'Column 5'},
      ]
    //#endregion

    //#region drag
      const pickupColumn = (e: DragEvent, column: ITaskColumn, fromColumnIndex: number) => {
        console.log('pickup columns')
        console.log(e)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.dropEffect = 'move'

        e.dataTransfer.setData('from-column-index', fromColumnIndex.toString())
        e.dataTransfer.setData('column-category', column.category.toString())
        console.log(e.dataTransfer.getData('column-category'))
      }
      const moveTask = (e: DragEvent, toTasks: Task[], toTaskIndex: number) => {
        const fromColumnIndex = e.dataTransfer.getData('from-column-index')
        const fromTasks = columns[fromColumnIndex].tasks
        const fromTaskIndex = e.dataTransfer.getData('from-task-index')

        // this.$store.commit('MOVE_TASK', {
        //   fromTasks,
        //   fromTaskIndex,
        //   toTasks,
        //   toTaskIndex
        // })
      }
      const moveColumn = (e: DragEvent, toColumnIndex: number) => {
        const fromColumnIndex = e.dataTransfer.getData('from-column-index')

        // this.$store.commit('MOVE_COLUMN', {
        //   fromColumnIndex,
        //   toColumnIndex
        // })

      }
      const moveTaskOrColumn = (e: DragEvent, toTasks: Task[], toColumnIndex: number, toTaskIndex: number) => {
        const type = e.dataTransfer.getData('type')

        if (type === 'task') {
          moveTask(e, toTasks, toTaskIndex !== undefined ? toTaskIndex : toTasks.length)
        } else {
          moveColumn(e, toColumnIndex)
        }
      }
    //#endregion

    return {
      _columns,
      columns,
      pickupColumn,
      columnNames,
      allTasks,
      columnsComputed,
      categories
    }
  }
})
</script>

<style scoped>

</style>