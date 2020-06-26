<template>
<div class="message-writer-container box">

  <div class="columns">
    <div class="column">
      <div class="field">
        <div class="label">Subject</div>
        <div class="control">
          <input type="text" class="input" v-model="subjectEdit"/>
        </div>
      </div>
    </div>
  </div>

  <div class="columns">
    <div class="column">
      <div class="label">Message Body</div>
      <div class="message-writer-container box">
        <div class="message-input" contenteditable ref="contentEditable" @input="handleEdit">
          
        </div>
      </div>
    </div>
  </div>

  <div class="columns">
    <div class="column">
      <button @click="submit" class="button is-primary is-pulled-right">
        Submit
      </button>
    </div>
  </div>

</div>

</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import moment from 'moment'

import { MessageStore } from '../../store/message.store'
import { useStore, MESSAGE_STORE_SYMBOL } from '../../store'
import { ContactStore } from '../../store/contact.store'

import { IContact } from '../../interfaces/contact/contact.interface'
import { IMessage } from './../../interfaces/message/message.interface' 
import { Destination } from '../../interfaces/common/modal.interface'

import { useUpdateValues } from '../../composables/useUpdateValues'
import { useModal } from '../../composables/useModal'
export default defineComponent({
  name: 'MessageWriter',
  props: {
    message: {
      type: Object as () => IMessage,
      // TODO
      //  might need to do some work to get message draft to persist
      // #TODO
      required: false
    }
  },
  // emits: ['submit-message'],
  async setup(props, ctx) {

    const store = useStore()
    //#region messageUse
      const messageStore: MessageStore = store.modules[MESSAGE_STORE_SYMBOL]
      const allMessages = ref<IMessage[]>([])
      const messagesLoading = ref(true)
      allMessages.value = await messageStore.loadRecords('message')
      messagesLoading.value = false
    //#endregion
    // console.log('messages')
    // console.log(allMessagesRef.value)
    // const contactStore: ContactStore = store.modules['contactStore']
    // const _contact: Contact = await contactStore.getRecordById(props.message.contact._id)

    const destination: Destination = '#message-modal'
    const modal = useModal(destination)

    const messageEdit = ref<IMessage>(props.message)
    const subjectEdit = ref('')
    const bodyEdit = ref('')
    const messageTouched = ref(false)
    
    const contentEditable = ref<null | HTMLDivElement>(null)

    const handleEdit = () => {
      bodyEdit.value = contentEditable.value.innerText
    }

    //#region updateValues
      useUpdateValues(messageTouched, [subjectEdit, bodyEdit])
    //#endregion


    const submit = async function(e: any) {
      // console.log('submit - message writer')
      const nextId = (parseInt(messageStore.getLastId()) + 1).toString()
      console.log(nextId)
      if (messageTouched.value == true) {
        console.log('message touched')
        console.log(messageEdit)
        messageEdit.value._id = nextId
        messageEdit.value.subject = subjectEdit.value 
        messageEdit.value.body = bodyEdit.value
        messageEdit.value.edited = moment()
        await messageStore.createRecord(
          messageEdit.value,
          true
        )
        // delete placeholder with '-1' _id
        await messageStore.createRecord(
          props.message, 
        )
        messageTouched.value = false
      }
      modal.hideModal()
    }

    return {
      messageEdit,
      subjectEdit,
      contentEditable,
      handleEdit,
      submit
    } 
  }
})
</script>

<style scoped>

</style>