<template>
  <div class="had-text-centered task-column-category">{{ category }}</div>
  <div class="task-cells-container">
    <div class="task-cell-container"
      v-for="(task, taskIndex) in tasks"
      :key="task._id"
      draggable
      @dragstart="pickupTask($event, task, taskIndex, columnIndex)"
      @click="openCard(task)"
    >
      <TaskCell :task="task" />
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
    tasks: {
      type: Array as () => Task[],
      required: true
    },
    column: {
      type: Object as () => ITaskColumn,
      required: true
    },
    columnIndex: {
      type: Number,
      required: true
    }
  },

  emits: ['dragstart', 'draggable'],

  setup(props, ctx) {
    // const category = ref(props.column.category)
    // const tasks = ref<Task[]>(props.column.tasks.value)
    // console.log(tasks.value)

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
    //#endregion
    
    //#region taskCardModal

      const taskCardDestination: Destination = '#task-card-modal'

      const taskCardModal = useModal(taskCardDestination)

    //#endregion

    //#region openCard
      const router = useRouter()
      const openCard = (task: Task) => {
        taskCardModal.showModal()
        router.push({ name: '#task-card-modal', params: { id: task._id } })
      }
      const cardIsOpen = computed(() => {
        return router.currentRoute.value.name === taskCardDestination
      })
    //#endregion

    return {
      pickupTask,
      openCard
      // category,
      // tasks
    }
  }
})
</script>
