<template>
  <table class="table is-hoverable">
    <thead>
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Company</th>
        <th>Email</th>
        <th>Delete</th>
        <th>Edit</th>
        <th>Locked</th>
        <th>Message</th>
      </tr>
    </thead>
    <tr
      v-for="contact in contacts"
      :key="contact._id" 
      class="contact-row has-text-centered"   
    >
    
      <td class="id-cell" @click="openContactCard(contact)">
        <BaseIcon name="external-link" color="purple">{{ contact._id }}</BaseIcon>
      </td>

      <td v-if="contact.editable" contenteditable>
        <BaseInput type="text" name="Name" v-model="nameEdit" />
          {{ nameEdit }}
      </td>
      <td v-else>{{ contact.name }}</td>

      <td v-if="contact.editable" contenteditable>
        <BaseInput type="text" name="Company" v-model="companyEdit" />
          {{ companyEdit }}
      </td>
      <td v-else>{{ contact.company }}</td>

      <td v-if="contact.editable" contenteditable>
        <BaseInput type="text" name="Email" v-model="emailEdit" />
          {{ emailEdit }}
      </td>
      <td v-else>{{ contact.email }}</td>

      <td class="icon-cell" @click="handleConfirmDelete(contact)">
        <BaseIcon color="red" name="trash-2"></BaseIcon>
      </td>

      <td class="icon-cell" @click="toggleEditable(contact)">
        <BaseIcon color="blue" name="edit"></BaseIcon>        
      </td>

      <td class="icon-cell" v-if="contact.locked" @click="toggleLocked(contact)">
        <BaseIcon color="gold" name="lock"></BaseIcon>
      </td>
      <td class="icon-cell" v-else @click="toggleLocked(contact)">
        <BaseIcon color="silver" name="unlock"></BaseIcon>
      </td>

      <td class="icon-cell" @click="openMessageModal(contact)">
        <BaseIcon color="green" name="mail"></BaseIcon>        
      </td>

    </tr>
  </table>

  <teleport to="#delete-contact-modal" v-if="deleteContactModal.visible">
    <ModalWarning @delete-item="deleteContact" :destination="'#delete-contact-modal'"/>
  </teleport>

  <!-- <teleport to="#contact-card-modal" v-if="cardIsOpen"> -->
  <teleport to="#contact-card-modal" v-if="contactCardModal.visible">
    <!-- <router-view/> -->
    <ContactCard @update-contacts="updateContacts" :destination="'#contact-card-modal'"/>
  </teleport>

  <teleport to="#message-modal" v-if="messageModal.visible">
    <!-- <router-view/> -->
    <MessageWriter @send-message="sendMessage" :destination="'#message-modal'" :message="message"/>
  </teleport>


  <div />
</template>

<script lang="ts">
import moment from 'moment'
import { defineComponent, computed, ref, watch, onMounted } from 'vue'

import { useRouter } from 'vue-router'
import { useStore, MESSAGE_STORE_SYMBOL } from '../../store'
import { ContactStore } from '../../store/contact.store'
import { MessageStore } from '../../store/message.store'

import BaseInput from './../../components/common/BaseInput.vue'
import BaseIcon from './../../components/common/BaseIcon.vue'
import ModalWarning from './../../components/common/ModalWarning.vue'
import MessageWriter from './../../components/message/MessageWriter.vue'
import ContactCard from './ContactCard.vue'

import { IContact } from '../../interfaces/contact/contact.interface'
import { Field } from '../../interfaces/common/field.interface'
import { Destination } from '../../interfaces/common/modal.interface'
import { IMessage } from './../../interfaces/message/message.interface' 

import { useModal } from '../../composables/useModal'
import { useUpdateValues } from '../../composables/useUpdateValues'

export default defineComponent({
  name: 'ContactTable',

  props: {
    contacts: {
      type: Array,
      required: true
    }
  },

  components: {
    BaseInput,
    ModalWarning,
    BaseIcon,
    ContactCard,
    MessageWriter
  },

  emits: ['update-contacts'],

  async setup(props, ctx){
    
    //#region deleteContactModal

      const destination: Destination = '#delete-contact-modal'

      const deleteContactModal = useModal(destination)

    //#endregion

    //#region contactCardModal

      const contactCardDestination: Destination = '#contact-card-modal'

      const contactCardModal = useModal(contactCardDestination)

    //#endregion

    const router = useRouter()
    const store = useStore()
    //#region contactUse
      const contactStore: ContactStore = store.modules['contactStore']
      const allContactsRef = ref<Contact[]>()
      // const toggleEditable
    //#endregion

    //#region messageUse
      const messageStore: MessageStore = store.modules[MESSAGE_STORE_SYMBOL]
      const allMessages = ref<Message[]>([])
      const messagesLoading = ref(true)
      allMessages.value = await messageStore.loadRecords('message')
      messagesLoading.value = false
    //#endregion

    //#region openContactCard
      const openContactCard = (contact: IContact) => {
        contactCardModal.showModal()
        router.push({ name: '#contact-card-modal', params: { id: contact._id } })
      }
      const cardIsOpen = computed(() => {
        // console.log(router.currentRoute.value.name)
        // console.log(contactCardDestination)
        return router.currentRoute.value.name === contactCardDestination
      })
    //#endregion

    //#region messageModal

      const messageDestination: Destination = '#message-modal'

      const messageModal = useModal(messageDestination)

    //#endregion

    //#region createMessage
      const createMessage = (contact: IContact): IMessage => {
        const message: IMessage = {
          _id: '-1',
          itemId: '-1',
          subject: '',
          body: '',
          category: '',
          contact: contact,
          created: moment(),
          edited: moment(),
          editable: false,
          locked: true
        }
        return message
      }
    //#endregion

    const message = ref<IMessage>()
    //#region openMessageModal
      const openMessageModal = (contact: IContact) => {
        message.value = createMessage(contact)
        messageStore.createRecord(message.value, '', false)
        messageModal.showModal()
        router.push({ name: '#message-modal', params: { id: contact._id } })
      }
      const messageIsOpen = computed(() => {
        // console.log(router.currentRoute.value.name)
        // console.log(messageDestination)
        return router.currentRoute.value.name === messageDestination
      })
    //#endregion

    //#region sendMessage
      const sendMessage = (e) => {
        // console.log(e)
        // console.log(router.currentRoute.value)
      }
    //#endregion

    //#region updateContacts
      const updateContacts = () => ctx.emit('update-contacts')
    //#endregion

    //#region delete
      const confirmDelete = ref(false)
      const deleteCandidate = ref<IContact>(null)

      const handleConfirmDelete = (contact: IContact) => {
        if (contact.locked) {
          deleteCandidate.value = contact
          deleteContactModal.showModal()
        } else {
          deleteCandidate.value = contact
          deleteContact()
        }
      }
      
      const deleteContact = async (e?) => {
        // check for event
        // TODO
        // add check for foreign key"
        // #TODO
        if (e) {
          // check if correct destination
          if (e == destination) {
            deleteContactModal.hideModal()
            const deletedId = await contactStore.deleteRecord(deleteCandidate.value)
            // console.log('delete contact')
            // null check
            deleteCandidate.value._id == deletedId ? deleteCandidate.value = null : ''
            ctx.emit('update-contacts')
          }
        } else {
          // no event no deleteContactModal
          const deletedId = await contactStore.deleteRecord(deleteCandidate.value)
          // console.log('delete contact')
          // null check
          deleteCandidate.value._id == deletedId ? deleteCandidate.value = null : ''
          ctx.emit('update-contacts')
        }
      }
      
      const toggleLocked = async (contact: IContact) => {
        if (contact.locked == false) {
          await contactStore.toggleLocked(contact, true)
          ctx.emit('update-contacts')
        } else {
          await contactStore.toggleLocked(contact, false)
          ctx.emit('update-contacts')
        }
      }
    //#endregion

    //#region edit
      const nameEdit = ref() 
      const companyEdit = ref() 
      const emailEdit = ref()
      
      //#region updateValues
        const contactTouched = ref(false)
        useUpdateValues(contactTouched, [nameEdit, companyEdit, emailEdit])
      //#endregion

      const edits = { nameEdit, companyEdit, emailEdit, contactTouched } 

      const editContact = async (oldContact: Contact, newContact: Contact) => {
        contactStore.editRecord(
          oldContact, 
          newContact,
          '_id'
        )
      }


      const toggleEditable = async (oldContact: Contact) => {
        if (oldContact.editable == false) {
          contactStore.toggleEditable(oldContact, true)
          nameEdit.value = oldContact.name
          companyEdit.value = oldContact.company
          emailEdit.value = oldContact.email
        } else {
          if (contactTouched.value == true) {
            const newContact: Contact = {
              _id: oldContact._id,
              itemId: oldContact._id,
              name: nameEdit.value,
              company: companyEdit.value,
              email: emailEdit.value,
              created: oldContact.created,
              edited: moment(),
              editable: false,
              locked: true
            }
            await editContact(oldContact, newContact)
            contactTouched.value = false
            // this closes the edit window by updating the refs after newContact editable set to false
            // ctx.emit('update-contacts')
            ctx.emit('update-contacts')
          } else {
            contactStore.toggleEditable(oldContact, false)
          }
        }
      }

      // const toggleEditable = async (oldContact: Contact) => {
      //   if (oldContact.editable == false) {
      //     contactStore.toggleEditable(oldContact, true)
      //     nameEdit.value = oldContact.name
      //     companyEdit.value = oldContact.company
      //     emailEdit.value = oldContact.email
      //   } else {
      //     if (contactTouched.value == true) {
      //       const newContact: Contact = {
      //         _id: oldContact._id,
      //         name: nameEdit.value,
      //         company: companyEdit.value,
      //         email: emailEdit.value,
      //         created: oldContact.created,
      //         edited: moment(),
      //         editable: false,
      //         locked: true
      //       }
      //       await editContact(oldContact, newContact)
      //       contactTouched.value = false
      //       // this closes the edit window by updating the refs after newContact editable set to false
      //       // ctx.emit('update-contacts')
      //       ctx.emit('update-contacts')
      //     } else {
      //       contactStore.toggleEditable(oldContact, false)
      //     }
      //   }
      // }

    //#endregion

    return {
      messageModal,
      openMessageModal,
      sendMessage,
      message,
      cardIsOpen,
      openContactCard,
      contactTouched,
      nameEdit,
      companyEdit,
      emailEdit,
      updateContacts,
      deleteContactModal,
      contactCardModal,
      deleteContact,
      toggleEditable,
      toggleLocked,
      handleConfirmDelete
    }

  }
})
</script>

<style lang="scss">
</style>
