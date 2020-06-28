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

import { useModal } from '../composables/useModal'

import { Destination } from '../interfaces/common/modal.interface'

export default defineComponent({
  name: 'MainLayout',

  components: {
    BaseModal
  },
  setup(props, ctx) {

    const editItemDestination: Destination = '#edit-item-modal'
    const deleteItemDestination: Destination = '#delete-item-modal'
    const contactDeleteDestination: Destination = '#delete-contact-modal'
    const taskDeleteDestination: Destination = '#delete-task-modal'
    const contactCardDestination: Destination = '#contact-card-modal'
    const taskCardDestination: Destination = '#task-card-modal'
    const messageDestination: Destination = '#message-modal'

    const destinations: Destination[] = [
      editItemDestination,
      deleteItemDestination,
      contactDeleteDestination,
      taskDeleteDestination,
      contactCardDestination,
      taskCardDestination,
      messageDestination
    ]
    
    const itemEditModal = useModal(editItemDestination)
    const itemDeleteModal = useModal(deleteItemDestination)
    const contactDeleteModal = useModal(contactDeleteDestination)
    const taskDeleteModal = useModal(taskDeleteDestination)
    const contactCardModal = useModal(contactCardDestination)
    const taskCardModal = useModal(taskCardDestination)
    const messageModal = useModal(messageDestination)

    // any modal works to access getModel
    const thisModalVisibility = destination => itemDeleteModal.getModal(destination).visible.value

    return {
      thisModalVisibility,
      destinations,
      itemEditModal,
      itemDeleteModal,
      contactDeleteModal,
      taskDeleteModal,
      contactCardModal,
      taskCardModal,
      messageModal
    }

  }
})
</script>

<style lang="scss">
</style>
