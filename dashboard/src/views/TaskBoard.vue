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
            @dragstart.self="pickupColumn($event, column)"
            @dragover.prevent
            @dragenter.prevent
            @drop="moveTaskOrColumn($event, column, columnIndex)"
          >
            <TaskColumn
              :column="column" 
              :category="column.category"
              :tasks-map="column.tasks"
              :column-index="columnIndex"
              :column-names="columnNames"
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
import { useStorage } from './../composables/useStorage'
import useColumns from './../composables/useColumns'
import { useStore } from '../store'
import { ColumnStore } from '../store/column.store'
import { sortObject } from './../utils'
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

    const storage = useStorage()

    const categories = computed<string[]>(() => {
      const catArr = []
      props.tasks.forEach(task => {
        if (!catArr.includes(task.category)) {
          catArr.push(task.category)
        }
      })
      return catArr
    })

      // init orderMap
    // const orderMap = computed(() => {
    //   let orderMap = storage.get('board')
    //   if (!orderMap) {
    //     orderMap = {}
    //     categories.value.map((category, i) => {
    //       const order = {}
    //       order[category] = i
    //       return Object.assign(orderMap, order)
    //     })
    //     storage.set('board', orderMap)
    //   }
    //   let order = []
    //   for (let category in orderMap) {
    //     order.push([category, orderMap[category]])
    //   }
    //   order = order.sort((a, b) => a[1] - b[1])
    //   const sortedCategoryColumns = {}
    //   order.forEach(item => sortedCategoryColumns[item[0]] = item[1])
    //   return sortedCategoryColumns

    // })

    // const orderMap = computed((categoryColumns) => {
    //   const sortable = []
    //   categoryColumns.forEach(column => {
    //     sortable.push({
    //       id: column.id,
    //       order: column.order
    //     })

    //   })
    //   return sortable
    // })

    const columnsComputed = computed<ITaskColumn[]>((): ITaskColumn[] => {
      const categoryColumns: Record<string, ITaskColumn> = {}
      // console.log(categoryColumns)
      props.tasks.forEach((task, i) => {
        if (task) {
          if (task.category in categoryColumns) {
            // console.log('debug 1')
            // console.log(categoryColumns[task.category])
            categoryColumns[task.category][task._id] = task
            // console.log(categoryColumns[task.category])
          }else {
            // console.log('debug 2')
            // console.log('category')
            // console.log(task.category)
            // console.log(categoryColumns[task.category])
            categoryColumns[task.category] = {} as ITaskColumn
            // console.log('debug 3')
            // console.log(categoryColumns[task.category])
            // init new id if new column
            // console.log('debug 4')
            // console.log(categoryColumns[task.category])
            // categoryColumns[task.category][task._id] = <Task>{}
            categoryColumns[task.category][task._id] = task
            // console.log('debug 5')
            // console.log(categoryColumns[task.category])
          }
        }
      })
      // console.log('columns computed')
      // console.log(categoryColumns)
      const out = []
      let orderMapping = {}
      Object.entries(categoryColumns).forEach((col, i) => {
        const category = col[0]
        const order = col[1].category
        orderMapping[category] = order
      })
      orderMapping = sortObject(orderMapping)

      // categoryColumns.forEach(column => {
      //   sortable.push({
      //     id: column.id,
      //     order: column.order
      //   })


      Object.keys(orderMapping).forEach((category, i) => {
        // console.log('mapper')
        const tasks = []
        Object.entries(categoryColumns[category]).forEach((col, i) => {
          const taskId = col[0]
          const task = col[1]
          tasks.push(task)
        })

        out.push({
          order: i,
          category: category,
          tasks: tasks
        })
      })
      // const out: ITaskColumn[] = Object.keys(orderMap.value).map((category, i) => ({
      //   id: categoryColumns[category]['id'],
      //   order: i,
      //   category: category,
      //   tasks: categoryColumns[category]
      // }))

      // const out = Object.keys(categoryColumns).map((category, i) => ({
      //   id: i,
      //   category: category,
      //   tasks: categoryColumns[category]
      // }))
      // console.log(out)
      return out
    })

    columns.value = columnsComputed.value
    const columnStore: ColumnStore = useStore().modules['columnStore']
    const columnsUse = useColumns(columnStore, columnsComputed.value)
    console.log('col store')
    // console.log(columnStore.getState().records.all)

    //#region drag
      const pickupColumn = (e: DragEvent, fromColumn: ITaskColumn) => {
        console.log('pickup columns')
        // console.log(e)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.dropEffect = 'move'
        
        e.dataTransfer.setData('type', 'column')
        e.dataTransfer.setData('from-column-category', fromColumn.category)
        // console.log(e.dataTransfer.getData('column-category'))
      }
      const moveTask = (e: DragEvent, toColumn: ITaskColumn, toTaskIndex: number) => {
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
      const moveColumn = (e: DragEvent, toColumn: ITaskColumn) => {
        const fromColumnCategory = e.dataTransfer.getData('from-column-category')
        const fromColumn: ITaskColumn = columnStore.getRecordById(fromColumnCategory)
        const fromColumnOrder = fromColumn.order
        fromColumn.order = toColumn.order
        // columnStore.editRecord()
        
        toColumn.order = fromColumnOrder

        // let orderMap = storage.get('board')
        // // let fromColumnIndex = orderMap[fromColumnCategory]
        // // console.log(orderMap)
        // console.log('from column index', fromColumnIndex)
        // orderMap[fromColumnCategory] = toColumn.order
        // console.log(orderMap)
        // orderMap[toColumn.category] = fromColumnIndex
        // console.log(orderMap)
        // storage.set('board', orderMap)
        
        // this.$store.commit('MOVE_COLUMN', {
        //   fromColumnIndex,
        //   toColumnIndex
        // })

      }
      const moveTaskOrColumn = (e: DragEvent, toColumn: ITaskColumn, toColumnIndex: number, toTaskIndex: number) => {
        console.log('move task or column - task column')
        const type = e.dataTransfer.getData('type')
        console.log(type)
        console.log(e)
        console.log(toColumn)
        console.log(toColumnIndex)
        console.log(toTaskIndex)

        if (type === 'task') {
          // moveTask(e, toTasks, toTaskIndex !== undefined ? toTaskIndex : toTasks.length)
        } else {
          moveColumn(e, toColumn)
        }
      }
    //#endregion

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

    return {
      _columns,
      columns,
      pickupColumn,
      columnNames,
      allTasks,
      columnsComputed,
      categories,
      moveTaskOrColumn
    }
  }
})
</script>

<style scoped>

</style>