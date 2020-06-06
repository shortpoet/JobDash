
<template>
  <article class="message is-danger">
    <div class="message-header">
      <p>Oh hey</p>
      <button class="delete" @click="modal.hideModal"></button>
    </div>
    <div class="message-body">Are you sure you want to delete that?</div>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useModal } from "../../composables/useModal";


export default defineComponent({
  
  name: 'ModalWarning',

  setup(props, ctx) {
    return {
      modal: useModal()
    }
  }
})
</script>