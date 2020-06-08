<template>
  <div class="columns">
    <div class="column is-one-half">      
      <TaskCreate @update-tasks="onUpdateTasks"/>
    </div>
    <div class="column is-one-half">
      <TaskTable :tasks="allTasks" @update-tasks="onUpdateTasks"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

import TaskCreate from './../components/task/TaskCreate.vue'

import TaskTable from './../components/task/TaskTable.vue'

import { Destination } from '../interfaces/modal.interface'

import { useModal } from '../composables/useModal'

import { Task } from '../interfaces/task.interface'
import useTask from '../composables/useTask'

export default defineComponent({
  name: 'TaskLayout',

  components: {
    TaskCreate,
    TaskTable,
  },
  async setup(props, ctx) {
    const contactDestination: Destination = '#delete-contact-modal'
    const taskDestination: Destination = '#delete-task-modal'
    const contactModal = useModal(contactDestination)
    const taskModal = useModal(taskDestination)

    //#region tasks
      const allTasks = ref<Task[]>([])

      // is this correct usage of provide/inject
      const taskUse = await useTask(allTasks)

      const onUpdateTasks = taskUse.onUpdateTasks
    //#endregion



    return {
      contactModal,
      taskModal,
      allTasks,
      onUpdateTasks
    }

  }
})
</script>

<style lang="scss">
</style>
