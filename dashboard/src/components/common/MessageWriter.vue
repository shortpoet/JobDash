<template>
  <div class="columns">
    <div class="column">
      <div class="message-writer-container">
        <div class="message-input box" contenteditable ref="contentEditable" @input="handleEdit">
          
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <button class="button is-primary is-pulled-right">
          Submit
        </button>
      </div>
    </div>

  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MessageWriter',
  props: {
    message: {
      type: Object as () => Message,
      required: true
    }
  },
  emits: ['submit-message'],
  setups(props, ctx) {
    const contentEditable = ref<null | HTMLDivElement>(null)
    const handleEdit = () => message.text = contentEditable.value.innerText 
  }
})
</script>

<style scoped>

</style>