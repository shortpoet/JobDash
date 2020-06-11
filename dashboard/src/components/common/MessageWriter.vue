<template>
<div class="message-writer-container">

  <div class="columns">
    <div class="column">
      <div class="field">
        <div class="label">Message Subject</div>
        <div class="control">
          <input type="text" class="input" v-model="messageEdit.subject"/>
          {{ messageEdit.subject }}
        </div>
      </div>
    </div>
  </div>

  <div class="columns">
    <div class="column">
      <div class="message-writer-container">
        <div class="message-input box" contenteditable ref="contentEditable" @input="handleEdit">
          
        </div>
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
import { Message } from './../../interfaces/message.interface' 
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

    const messageEdit = ref<Message>(props.message)
    const contentEditable = ref<null | HTMLDivElement>(null)

    
    const handleEdit = () => {
      messageEdit.value.body = contentEditable.value.innerText
    }
    return {
      messageEdit,
      contentEditable,
      handleEdit
    } 
  }
})
</script>

<style scoped>

</style>