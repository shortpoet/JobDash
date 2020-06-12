<template>
  <div class="had-text-centered task-column-category">{{ category }}</div>
  <div class="task-cells-container">
    <div class="task-cell-container"
      v-for="(task, taskIndex) in tasksMap"
      :key="task._id"
      draggable
      @dragstart="pickupTask($event, task, taskIndex, columnIndex)"
      @click="openCard(task)"
      @drag.stop="moveTaskOrColumn($event, tasks, columnIndex, taskIndex)"
    >
      <TaskCell :task="task" :task-name="task.name" :task-id="task._id"/>
    </div>
  </div>
  <div />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import TaskCell from './TaskCell.vue'
import { ITaskColumn } from '../../interfaces/task.column.interface'
import { Task } from '../../interfaces/task.interface'
import { Destination } from '../../interfaces/modal.interface'
import { useModal } from '../../composables/useModal'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'TaskColumn',
  components: {
    TaskCell
  },
  props: {
    category: {
      type: String,
      required: true
    },
    tasksMap: {
      type: Object as () => Record<string, Task>,
      required: true
    },
    column: {
      type: Object as () => ITaskColumn,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    },
    columnNames: {
      type: Array,
      required: true
    },
    allTasks: {
      type: Array as () => Task[],
      required: true
    }
  },

  emits: ['dragstart', 'draggable'],

  setup(props, ctx) {
    // const category = ref(props.column.category)
    // const tasks = ref<Task[]>(props.column.tasks.value)
    // console.log(tasks.value)

    const tasks = computed(() => Object.values(props.tasksMap))
    // console.log(tasks.value)

    //#region taskCardModal

      const taskCardDestination: Destination = '#task-card-modal'

      const taskCardModal = useModal(taskCardDestination)

    //#endregion

    //#region openCard
      const router = useRouter()
      const openCard = (task: Task) => {
        console.log('task column')
        // console.log(task)
        console.log(task._id)
        // console.log(task.category)

        taskCardModal.showModal()
        router.push({ name: '#task-card-modal', params: { id: task._id } })
      }
      const cardIsOpen = computed(() => {
        return router.currentRoute.value.name === taskCardDestination
      })
    //#endregion

    //#region drag
      const pickupTask = (e: DragEvent, task: Task, fromTaskIndex: number, fromColumnIndex: number) => {
        console.log('pickup task')

        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.dropEffect = 'move'

        e.dataTransfer.setData('task-category', task.category.toString())
        e.dataTransfer.setData('from-column-index', fromColumnIndex.toString())
        e.dataTransfer.setData('from-task-index', fromTaskIndex.toString())
        e.dataTransfer.setData('type', 'task')
      }

      const moveTask = (e: DragEvent, toTasks: Task[], toTaskIndex: number) => {
        const fromColumnIndex = e.dataTransfer.getData('from-column-index')
        const fromTaskCategory = props.columnNames[fromColumnIndex]
        const fromTasks = props.allTasks.filter(task => task.category == fromTaskCategory)
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
      pickupTask,
      openCard,
      // category,
      tasks
    }
  }
})
</script>
