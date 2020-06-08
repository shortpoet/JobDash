<template>
  <div :class="['base-modal', 'modal', modal.visible ? 'is-active' : '']">
    <div class="modal-background"></div>
    <div class="modal-content">
      <slot name="destination" :close="modal.hideModal"/>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="modal.hideModal"></button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import { useModal } from '../../composables/useModal'

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
        required: true
      }
    },

    setup(props, ctx) {
      const modal = useModal(props.destination)

      return {
        modal
      }

    }

  })

</script>

<style scoped>

</style>