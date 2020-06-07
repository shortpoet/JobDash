<template>
  <BaseModal :style="modalDisplay" :isActive="modal.visible">
    <template #destination>
      <div class="" id="modal-warning">
      </div>
    </template>
  </BaseModal>
  <Contact />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import BaseModal from './../components/common/BaseModal.vue'
import Contact from './Contact.vue'
import { useModal } from '../composables/useModal'
export default defineComponent({
  name: 'Home',

  components: {
    Contact,
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
