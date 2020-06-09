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
      </tr>
    </thead>
    <tr
      v-for="contact in contacts"
      :key="contact._id" 
      class="contact-row"   
    >
    
      <!--
        Using a component here createD a bug
        update: no longer; wonder what the issue with my code
      -->

      <!-- <ContactRow :contact="contact" @update-contacts="updateContacts" /> -->

      <td class="id-cell" @click="openCard(contact._id)">
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

      <td class="icon-cell" v-if="contact.locked" @click="toggleDeletable(contact)">
        <BaseIcon color="gold" name="lock"></BaseIcon>
      </td>
      <td class="icon-cell" v-else @click="toggleDeletable(contact)">
        <BaseIcon color="silver" name="unlock"></BaseIcon>
      </td>

    </tr>
  </table>

  <teleport to="#delete-contact-modal" v-if="deleteContactModal.visible">
    <ModalWarning @delete-item="deleteContact" :destination="'#delete-contact-modal'"/>
  </teleport>

  <teleport to="#contact-card-modal" v-if="contactCardModal.visible">
    <router-view/>
    <ContactCard @save-item="editContact" :destination="'#contact-card-modal'"/>
  </teleport>


  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import moment from 'moment'

import BaseInput from './../../components/common/BaseInput.vue'
import BaseIcon from './../../components/common/BaseIcon.vue'
import ModalWarning from './../../components/common/ModalWarning.vue'

import ContactCard from './ContactCard.vue'

import { Contact } from '../../interfaces/contact.interface'
import { Field } from '../../interfaces/field.interface'
import { Destination } from '../../interfaces/modal.interface'

import { useModal } from '../../composables/useModal'
import useContact from '../../composables/useContact'
import { useStore } from '../../store'

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
    ContactCard
  },

  emits: ['update-contacts'],

  async setup(props, ctx){

    const updateContacts = () => {
      ctx.emit('update-contacts')
    }
    
    //#region deleteContactModal

    const destination: Destination = '#delete-contact-modal'

    const deleteContactModal = useModal(destination)

    const contactCardDestination: Destination = '#contact-card-modal'

    const contactCardModal = useModal(contactCardDestination)

    //#endregion

    //#region contactUse

      const store = useStore()
      const contactStore = store.modules['contactStore']

    //#endregion

    //#region openCard
      const router = useRouter()
      const openCard = (_id) => {
        console.log(_id)
        console.log(ctx)
        contactCardModal.showModal()
        router.push({ name: '#contact-card-modal', params: { id: _id } })
      }
    //#endregion

    //#region delete
      const confirmDelete = ref(false)
      const deleteCandidate = ref<Contact>(null)

      const handleConfirmDelete = (contact: Contact) => {
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
        if (e) {
          // check if correct destination
          if (e == destination) {
            deleteContactModal.hideModal()
            const deletedId = await contactStore.deleteContact(deleteCandidate.value)
            console.log('delete contact')
            // null check
            deleteCandidate.value._id == deletedId ? deleteCandidate.value = null : ''
            ctx.emit('update-contacts')
          }
        } else {
          // no event no deleteContactModal
          const deletedId = await contactStore.deleteContact(deleteCandidate.value)
          console.log('delete contact')
          // null check
          deleteCandidate.value._id == deletedId ? deleteCandidate.value = null : ''
          ctx.emit('update-contacts')
        }
      }
      
      const toggleDeletable = async (contact: Contact) => {
        if (contact.locked == false) {
          await contactStore.toggleDeletable(contact, true)
          ctx.emit('update-contacts')
        } else {
          await contactStore.toggleDeletable(contact, false)
          ctx.emit('update-contacts')
        }
      }
    //#endregion

    //#region edit
      const nameEdit = ref() 
      const companyEdit = ref() 
      const emailEdit = ref()
      const contactTouched = ref(false)

      const toggleEditable = async (oldContact: Contact) => {
        if (oldContact.editable == false) {
          contactStore.toggleEditable(oldContact, true)
          nameEdit.value = oldContact.name
          companyEdit.value = oldContact.company
          emailEdit.value = oldContact.email
          // without this line when using module toggle wouldn't update
          // v-if wasn't triggered
          ctx.emit('update-contacts')

        } else {
          if (contactTouched.value == true) {
            const newContact: Contact = {
              _id: oldContact._id,
              name: nameEdit.value,
              company: companyEdit.value,
              email: emailEdit.value,
              created: oldContact.created,
              edited: moment(),
              editable: false,
              locked: true
            }
    
            await contactStore.editContact(
              oldContact, 
              newContact
            )
            contactTouched.value = false
            // this closes the edit window by updating the refs after newContact editable set to false
            // ctx.emit('update-contacts')
            ctx.emit('update-contacts')
          } else {
            contactStore.toggleEditable(oldContact, false)
          }
        }
      }

      const updateField = (value: string, previous: string) => {
          if (previous) {
            contactTouched.value = true
          }
        }
      
      watch(
        () => nameEdit.value,
        (value: string, previous: string) => updateField(value, previous)
      )
      watch(
        () => companyEdit.value,
        (value: string, previous: string) => updateField(value, previous)
      )
      watch(
        () => emailEdit.value,
        (value: string, previous: string) => updateField(value, previous)
      )
    //#endregion

    return {
      openCard,
      updateContacts,
      contactTouched,
      nameEdit,
      companyEdit,
      emailEdit,
      deleteContactModal,
      contactCardModal,
      deleteContact,
      toggleEditable,
      toggleDeletable,
      handleConfirmDelete
    }

  }
})
</script>

<style lang="scss">
</style>
