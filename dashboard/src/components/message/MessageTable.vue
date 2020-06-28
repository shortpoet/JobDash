<template>
  <table class="table is-hoverable">
    <thead>
      <tr>
        <th>Id</th>
        <th>To</th>
        <th>Category</th>
        <th>Subject</th>
        <th>Body</th>
        <th>Delete</th>
        <th>Edit</th>
        <th>Locked</th>
      </tr>
    </thead>
    <tr
      v-for="message in messages"
      :key="message._id" 
      class="message-row"   
    >

      <td class="has-text-left id-cell" @click="openCard(message)">
        <BaseIcon name="external-link" color="purple">{{ message._id }}</BaseIcon>
      </td>

      <td class="has-text-centered">{{ message.contact.name }}</td>

      <td v-if="message.editable" contenteditable>
        <BaseInput type="text" name="Category" v-model="categoryEdit" />
          {{ categoryEdit }}
      </td>
      <td class="has-text-centered" v-else>{{ message.category }}</td>

      <td v-if="message.editable" contenteditable>
        <BaseInput type="text" name="Subject" v-model="subjectEdit" />
          {{ subjectEdit }}
      </td>
      <td class="has-text-centered" v-else>{{ message.subject }}</td>


      <td v-if="message.editable" contenteditable>
        <BaseInput type="text" name="Body" v-model="bodyEdit" />
          {{ bodyEdit }}
      </td>
      <td class="has-text-centered" v-else>{{ message.body }}</td>

      <td class="icon-cell" @click="handleConfirmDelete(message)">
        <BaseIcon color="red" name="trash-2"></BaseIcon>
      </td>

      <td class="icon-cell" @click="toggleEditable(message)">
        <BaseIcon color="blue" name="edit"></BaseIcon>        
      </td>

      <td class="icon-cell" v-if="message.locked" @click="toggleLocked(message)">
        <BaseIcon color="gold" name="lock"></BaseIcon>
      </td>
      <td class="icon-cell" v-else @click="toggleLocked(message)">
        <BaseIcon color="silver" name="unlock"></BaseIcon>
      </td>

    </tr>
  </table>

  <teleport to="#delete-message-modal" v-if="modal.visible">
    <ModalWarning @delete-item="deleteMessage" :destination="'#delete-message-modal'"/>
  </teleport>

  <teleport to="#message-modal" v-if="messageModal.visible">
    <!-- <router-view/> -->
    <MessageWriter @send-message="sendMessage" :message="message"/>
  </teleport>

  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import moment from 'moment'
import { useStore } from '../../store'
import { useRouter } from 'vue-router'
import { MessageStore } from '../../store/message.store'
import { useUpdateValues } from '../../composables/useUpdateValues'

import BaseInput from './../../components/common/BaseInput.vue'
import BaseIcon from './../../components/common/BaseIcon.vue'
import ModalWarning from './../../components/common/ModalWarning.vue'
import MessageWriter from './../message/MessageWriter.vue'


import { IMessage } from '../../interfaces/message/message.interface'
import { Field } from '../../interfaces/common/field.interface'
import { Destination } from '../../interfaces/common/modal.interface'

import { useModal } from '../../composables/useModal'

export default defineComponent({
  name: 'MessageTable',

  props: {
    messages: {
      // type: Object.prototype.constructor(messageStore),
      type: Array,
      required: true
    }
  },

  components: {
    BaseInput,
    ModalWarning,
    BaseIcon,
    MessageWriter
  },

  emits: ['update-messages'],

  async setup(props, ctx){

    onMounted(() => {
      // const messages: Message[] = props.messages.forEach(message => {
      //   console.log(message.contact)
      // })
    })


    const store = useStore()
    const messageStore: MessageStore = store.modules['messageStore']



    //#region messageCardModal

      const messageCardDestination: Destination = '#message-modal'

      const targetsLoaded = computed(() => {
        // console.log('target loaded')
        const out = !!document.querySelector(destination)
        // console.log(out)
        return out
      })

      const messageModal = useModal(messageCardDestination)

    //#endregion

    //#region openCard
      const router = useRouter()
      const openCard = (message: IMessage) => {
        // console.log('message table')
        // console.log(message._id)
        messageModal.showModal()
        router.push({
          name: '#message-modal',
          path: `/message/${message._id}`,
          params: { id: message._id } 
        })
      }
    //#endregion

    //#region updateMessages
      const updateMessages = () => ctx.emit('update-messages')
    //#endregion

    //#region messageUse
      // const messageStore: MessageStore = store.modules['messageStore']
      // Object.prototype.constructor(messageStore)
    //#endregion

    //#region delete
      const confirmDelete = ref(false)
      const deleteCandidate = ref<IMessage>(null)
      const destination: Destination = '#message-modal'
      const modal = useModal(destination)

      // const modal = useModal()
      // this didn't properly return a reactive ref
      // const modalMap = useModalMap()
      // const destination = '#message-modal'
      // modalMap.addModal(destination)
      // const modal = modalMap.modalMap[destination]


      const handleConfirmDelete = (message: IMessage) => {
        if (message.locked) {
          deleteCandidate.value = message
          modal.showModal()
        } else {
          deleteCandidate.value = message
          deleteMessage()
        }
      }
      
      const deleteMessage = async (e?) => {
        if (e) {
          if (e == destination) {
            modal.hideModal()
            const deletedId = await messageStore.deleteRecord(deleteCandidate.value)
            // console.log('delete message')
            deleteCandidate.value._id == deletedId ? deleteCandidate.value = null : ''
            // null check
            // console.log(deleteCandidate.value)
            ctx.emit('update-messages')
          }          
        } else {
          const deletedId = await messageStore.deleteRecord(deleteCandidate.value)
          // console.log('delete message')
          deleteCandidate.value._id == deletedId ? deleteCandidate.value = null : ''
          // null check
          // console.log(deleteCandidate.value)
          ctx.emit('update-messages')
        }
      }
      
      const toggleLocked = async (message: IMessage) => {
        // console.log('message table')
        // console.log(message.locked)
        if (message.locked == false) {
          await messageStore.toggleLocked(message, true)
          ctx.emit('update-messages')
          // console.log(message.locked)
        } else {
          await messageStore.toggleLocked(message, false)
          ctx.emit('update-messages')
          // console.log(message.locked)
        }
      }
    //#endregion

    //#region edit
      const subjectEdit = ref() 
      const categoryEdit = ref() 
      const bodyEdit = ref() 
      
      //#region updateValues
        const messageTouched = ref(false)
        useUpdateValues(messageTouched, [subjectEdit, categoryEdit, bodyEdit])
      //#endregion

      const toggleEditable = async (oldMessage: Message) => {
        if (oldMessage.editable == false) {
          messageStore.toggleEditable(oldMessage, true)
          subjectEdit.value = oldMessage.subject
          categoryEdit.value = oldMessage.category
          bodyEdit.value = oldMessage.body
        } else {
          if (messageTouched.value == true) {
            const newMessage: Message = {
              _id: oldMessage._id,
              itemId: oldMessage.itemId,
              subject: subjectEdit.value,
              category: categoryEdit.value,
              body: bodyEdit.value,
              contact: oldMessage.contact,
              created: oldMessage.created,
              edited: moment(),
              editable: false,
              locked: true
            }
    
            await messageStore.editRecord(
              oldMessage, 
              newMessage,
              '_id'
            )
            messageTouched.value = false
            // this closes the edit window by updating the refs after newMessage editable set to false
            ctx.emit('update-messages')
          } else {
            messageStore.toggleEditable(oldMessage, false)
          }
        }
      }

    //#endregion

    return {
      messageTouched,
      subjectEdit,
      categoryEdit,
      bodyEdit,
      modal,
      targetsLoaded,
      messageModal,
      openCard,
      updateMessages,
      deleteMessage,
      toggleEditable,
      toggleLocked,
      handleConfirmDelete
    }

  }
})
</script>

<style lang="scss">
</style>
