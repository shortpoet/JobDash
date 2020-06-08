<template>

  <div class="columns">
    <div class="column is-one-third">
      <TaskCreate />
    </div>
    <div class="column is-two-thirds">
      <ContactBoard />
    </div>
  </div>

  <TaskBoard />
  
  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import BaseModal from './../components/common/BaseModal.vue'
import TaskCreate from './../components/task/TaskCreate.vue'
import ContactBoard from './ContactBoard.vue'
import TaskBoard from './TaskBoard.vue'
import { useModal } from '../composables/useModal'
import { Destination } from '../interfaces/modal.interface'
export default defineComponent({
  name: 'TableLayout',

  components: {
    ContactBoard,
    TaskBoard,
    TaskCreate,
    BaseModal
  },
  setup(props, ctx) {
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
