<template>
  <!--
    * watch for nested section.section
    * will start nesting relative padding (I think)
  -->
  <section class="section board-section">

    <div class="container the-board">
      <div class="columns-container">
        <div class="columns is-centered">
          <!-- column class here makes column background expand past name to fill available space except padding -->
          <!-- 
            must use $event as variable
            @dragstart.self so that nested pickupTask doesn't trigger this event listener
          -->
          <div class="column board-column-container"
            v-for="(column, columnIndex) in columnsComputed"
            :key="column.id"
            draggable
            @dragstart.self="pickupColumn($event, column)"
            @dragover.prevent
            @dragenter.prevent
            @drop="moveTaskOrColumn($event, column, columnIndex)"
          >
            <BoardColumn
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

    <div class="the-board container">
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
import { IBoardColumn } from './../interfaces/board.column.interface'
import { Task } from '../interfaces/task.interface'
import BoardColumn from './../components/board/BoardColumn.vue'
import { useStorage } from './../composables/useStorage'
import useColumns from './../composables/useColumns'
import { useStore } from '../store'
import { ColumnStore } from '../store/column.store'
import { sortObject } from './../utils'
export default defineComponent({
  name: 'TaskBoard',

  components: {
    BoardColumn
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
    
    const columns = ref<IBoardColumn[]>([])

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

    const columnsComputed = computed<IBoardColumn[]>((): IBoardColumn[] => {
      const categoryColumns: Record<string, IBoardColumn> = {}
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
            categoryColumns[task.category] = {} as IBoardColumn
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
      // if (!columnStore.getState().records.loaded) {
      //   orderMapping = {}
      // }
      Object.entries(categoryColumns).forEach((col, i) => {
        console.log(col)
        const category = col[0]
        const order = col[1].category
        orderMapping[category] = order
      })
      console.log(orderMapping)
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
      // const out: IBoardColumn[] = Object.keys(orderMap.value).map((category, i) => ({
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
      const pickupColumn = (e: DragEvent, fromColumn: IBoardColumn) => {
        console.log('pickup columns')
        // console.log(e)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.dropEffect = 'move'
        
        e.dataTransfer.setData('type', 'column')
        e.dataTransfer.setData('from-column-category', fromColumn.category)
        e.dataTransfer.setData('from-column-id', fromColumn.order.toString())
        e.dataTransfer.setData('from-column-order', fromColumn.order.toString())
        // console.log(e.dataTransfer.getData('column-category'))
      }
      const moveTask = (e: DragEvent, toColumn: IBoardColumn, toTaskIndex: number) => {
        const fromColumnIndex = e.dataTransfer.getData('from-column-index')
        const fromColumnId = e.dataTransfer.getData('from-column-id')
        const fromColumnOrder = e.dataTransfer.getData('from-column-order')
        const fromTasks = columns[fromColumnIndex].tasks
        const fromTaskIndex = e.dataTransfer.getData('from-task-index')

        // this.$store.commit('MOVE_TASK', {
        //   fromTasks,
        //   fromTaskIndex,
        //   toTasks,
        //   toTaskIndex
        // })
      }
      const moveColumn = (e: DragEvent, toColumn: IBoardColumn) => {
        const fromColumnCategory = e.dataTransfer.getData('from-column-category')
        const fromColumnIndex = e.dataTransfer.getData('from-column-index')
        const fromColumnId = e.dataTransfer.getData('from-column-id')
        // const fromColumnOrder = e.dataTransfer.getData('from-column-order')

        console.log(fromColumnCategory)
        const fromColumn: IBoardColumn = columnStore.getRecordById(fromColumnCategory)
        let fromColumnCopy: IBoardColumn = {...fromColumn}
        // save the value of the old column's order to set toColumn
        const fromColumnOrder = fromColumn.order
        // set the new value for fromColumn
        fromColumnCopy.order = toColumn.order
        columnStore.editRecord(fromColumn, fromColumnCopy, 'category')

        let toColumnCopy: IBoardColumn = {...toColumn}
        toColumnCopy.order = fromColumnOrder
        columnStore.editRecord(toColumn, toColumnCopy, 'category')

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
      const moveTaskOrColumn = (e: DragEvent, toColumn: IBoardColumn, toColumnIndex: number, toTaskIndex: number) => {
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
  
    const _columns = [
      {id:'1', category: 'Column 1'},
      {id:'2', category: 'Column 2'},
      {id:'3', category: 'Column 3'},
      {id:'4', category: 'Column 4'},
      {id:'5', category: 'Column 5'},
    ]

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