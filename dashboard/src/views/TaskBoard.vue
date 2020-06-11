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
            v-for="column in columns"
            :key="column.id"
            draggable
            @dragstart.self="pickupColumn($event, column)"
            @dragover.prevent
            @dragenter.prevent
          >
            <TaskColumn
              :column="column" 
              :category="column.category"
              :tasks="column.tasks"
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

  emits: ['dragstart', 'draggable'],

  async setup(props) {
    
    const columns = ref<ITaskColumn[]>([])

    const columnNames = ref([])

    //#region setColumns
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
          columns.value.push(iTaskColumn)
        })
      }

      watch(
        () => props.tasks.length.toString(),
        (value: string, previous: string) => {
          if (value != previous) {
            setColumns()
          }
        },
        {immediate: true}
      )

      const _columns = [
        {id:'1', category: 'Column 1'},
        {id:'2', category: 'Column 2'},
        {id:'3', category: 'Column 3'},
        {id:'4', category: 'Column 4'},
        {id:'5', category: 'Column 5'},
      ]
    //#endregion

    //#region drag
      const pickupColumn = (e: DragEvent, column: ITaskColumn) => {
        console.log('pickup columns')
        console.log(e)
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.dropEffect = 'move'

        e.dataTransfer.setData('column-category', column.category.toString())
        console.log(e.dataTransfer.getData('column-category'))
      }
    //#endregion

    return {
      _columns,
      columns,
      pickupColumn
    }
  }
})
</script>

<style scoped>

</style>