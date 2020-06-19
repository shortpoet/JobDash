
<template>
  <article class="message is-danger">
    <div class="message-header">
      <p>Oh hey</p>
      <button class="delete" @click="modal.hideModal"></button>
    </div>
    <div class="message-body">Are you sure you want to delete that?</div>
    <button class="button is-warning" @click="deleteItem">Delete</button>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useModal } from "../../composables/useModal";
import { colorLog } from "../../utils";

export default defineComponent({
  
  name: 'ModalWarning',

  props: {
    destination: {
      type: String,
      required: true
    }
  },

  emits: ['delete-item'],

  setup(props, ctx) {
    return {
      modal: useModal(props.destination),
      deleteItem: () => {
        colorLog('modal warning delete', 'green', 'silver')
        ctx.emit('delete-item')
      }
    }
  }
})
</script>