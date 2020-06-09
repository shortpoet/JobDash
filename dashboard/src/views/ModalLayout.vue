<template>
  <div>
    <BaseModal
      v-for="destination in destinations"
      :key="destination"
      :isActive="thisModalVisibility(destination)"
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

    
    const contactDeleteDestination: Destination = '#delete-contact-modal'
    const taskDeleteDestination: Destination = '#delete-task-modal'
    const contactCardDestination: Destination = '#contact-card-modal'
    const destinations: Destination[] = [contactDeleteDestination, taskDeleteDestination, contactCardDestination]
    const contactDeleteModal = useModal(contactDeleteDestination)
    const taskDeleteModal = useModal(taskDeleteDestination)
    const contactCardModal = useModal(contactCardDestination)

    // any modal works to access getModel
    const thisModalVisibility = destination => contactDeleteModal.getModal(destination).visible.value

    return {
      thisModalVisibility,
      destinations,
      contactDeleteModal,
      taskDeleteModal,
      contactCardModal
    }

  }
})
</script>

<style lang="scss">
</style>
