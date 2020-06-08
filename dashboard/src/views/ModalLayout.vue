<template>
  <div>
    <BaseModal
      v-for="destination in destinations"
      :key="destination"
      :isActive="taskModal.visible"
      :destination="destination"
    >
      <template #destination>
        <div class="" :id="destination.slice(1)">
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

import BaseModal from './../components/common/BaseModal.vue'

import { Destination } from '../interfaces/modal.interface'

import { useModal } from '../composables/useModal'
import useContact from '../composables/useContact'

import { Task } from '../interfaces/task.interface'
import useTask from '../composables/useTask'



export default defineComponent({
  name: 'MainLayout',

  components: {
    BaseModal
  },
  async setup(props, ctx) {

    
    const contactDestination: Destination = '#delete-contact-modal'
    const taskDestination: Destination = '#delete-task-modal'
    const destinations: Destination[] = [contactDestination, taskDestination]
    const contactModal = useModal(contactDestination)
    const taskModal = useModal(taskDestination)

    return {
      destinations,
      contactModal,
      taskModal
    }

  }
})
</script>

<style lang="scss">
</style>
