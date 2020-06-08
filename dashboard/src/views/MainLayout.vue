<template>
  <BaseModal :style="modalDisplay" :isActive="modal.visible">
    <template #destination>
      <div class="" id="modal-warning">
      </div>
    </template>
  </BaseModal>
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
export default defineComponent({
  name: 'Home',

  components: {
    ContactBoard,
    TaskBoard,
    TaskCreate,
    BaseModal
  },
  setup(props, ctx) {
    const modal = useModal()

    const modalDisplay = computed(() => ({
      // display: modal.visible.value ? 'block' : 'none'
    }))

    return {
      modal,
      modalDisplay
    }

  }
})
</script>

<style lang="scss">
</style>
