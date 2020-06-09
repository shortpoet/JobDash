<template>

  <ModalLayout />

  <div class="columns">
    <div class="column is-two-fifths">
      <TabsLayout />
      <!-- <TabsLayout @tab-change="tabChange"/> -->
    </div>
    <div class="column is-one-half">
      <TableLayout @update-contacts="onUpdateContacts" @update-tasks="onUpdateTasks"/>
    </div>
  </div>

  <TaskBoard />

  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

import ModalLayout from './ModalLayout.vue'


import TabsLayout from './TabsLayout.vue'
import TableLayout from './TableLayout.vue'

import TaskBoard from './TaskBoard.vue'

import { Destination } from '../interfaces/modal.interface'
import { useModal } from '../composables/useModal'

export default defineComponent({
  name: 'MainLayout',

  components: {
    ModalLayout,
    TabsLayout,
    TableLayout,
    TaskBoard
  },
  async setup(props, ctx) {
    
    const contactDestination: Destination = '#delete-contact-modal'
    const taskDestination: Destination = '#delete-task-modal'
    const contactModal = useModal(contactDestination)
    const taskModal = useModal(taskDestination)


    return {
      contactModal,
      taskModal
    }

  }
})
</script>

<style lang="scss">
</style>
