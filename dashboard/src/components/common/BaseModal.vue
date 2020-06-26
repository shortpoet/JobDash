<template>
  <div :class="['base-modal', 'modal', modal.visible ? 'is-active' : '']">
    <div class="modal-background"></div>
    <div class="modal-content">
      <slot name="destination" :close="handleModalClose"/>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="handleModalClose"></button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import { useModal } from '../../composables/useModal'
import { useRouter } from 'vue-router'

  export default defineComponent({

    name: 'BaseModal',

    props: {
      useButton: {
        type: Boolean,
        default: true
      },
      isActive: {
        type: Boolean,
        required: true
      },
      destination: {
        type: String,
        required: false
      }
    },

    setup(props, ctx) {
      const modal = useModal(props.destination)
      const router = useRouter()
      return {
        modal,
        handleModalClose: () => {modal.hideModal(); router.push('/')}
      }

    }

  })

</script>

<style scoped>

</style>