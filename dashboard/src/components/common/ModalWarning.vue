
<template>
  <article class="message is-danger">
    <div class="message-header">
      <p>Oh hey</p>
      <button class="delete" @click="modal.hideModal"></button>
    </div>
    <div class="message-body">Are you sure you want to delete that?</div>
    <button class="button is-warning" @click="deleteContact">Delete</button>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useModal } from "../../composables/useModal";


export default defineComponent({
  
  name: 'ModalWarning',

  emits: ['delete-contact'],

  setup(props, ctx) {
    return {
      modal: useModal(),
      deleteContact: () => ctx.emit('delete-contact')
    }
  }
})
</script>