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

      <td>{{ contact._id }}</td>

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
  <teleport to="#modal-warning" v-if="modal.visible">
    <ModalWarning @delete-contact="deleteContact"/>
  </teleport>
  <div />
    <!-- <Suspense>
      <template #default>

      </template>
      <template #fallback>

      </template>
    </Suspense> -->
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useContactStore } from './../../store/contact.store'
import ContactRow from './../../components/contacts/ContactRow.vue'
import BaseInput from './../../components/common/BaseInput.vue'
import BaseIcon from './../../components/common/BaseIcon.vue'
import ModalWarning from './../../components/common/ModalWarning.vue'
import { Contact } from '../../interfaces/contact.interface'
import { Field } from '../../interfaces/field.interface'
import moment from 'moment'
import { useModal } from '../../composables/useModal'

export default defineComponent({
  name: 'ContactTable',

  props: {
    contacts: {
      type: Array,
      required: true
    }
  },

  components: {
    ContactRow,
    BaseInput,
    ModalWarning,
    BaseIcon
  },

  emits: ['update-contacts'],

  async setup(props, ctx){

    const updateContacts = () => {
      ctx.emit('update-contacts')
    }

    // #region global
      const contactStore = useContactStore()
    // #endregion

    //#region delete
      const confirmDelete = ref(false)
      const deleteCandidate = ref<Contact>(null)
      const modal = useModal()

      const handleConfirmDelete = (contact: Contact) => {
        if (contact.locked) {
          deleteCandidate.value = contact
          modal.showModal()
        } else {
          deleteCandidate.value = contact
          deleteContact()
        }
      }
      
      const deleteContact = async () => {
        modal.hideModal()
        const deletedId = await contactStore.deleteContact(deleteCandidate.value)
        console.log('delete contact')
        // console.log(deletedId)
        deleteCandidate.value._id == deletedId ? deleteCandidate.value = null : ''
        // null check
        // console.log(deleteCandidate.value)
        ctx.emit('update-contacts')
      }
      
      const toggleDeletable = async (contact: Contact) => {
        // console.log('contact table')
        // console.log(contact.locked)
        if (contact.locked == false) {
          await contactStore.toggleDeletable(contact, true)
          ctx.emit('update-contacts')
          // console.log(contact.locked)
        } else {
          await contactStore.toggleDeletable(contact, false)
          ctx.emit('update-contacts')
          // console.log(contact.locked)
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
      updateContacts,
      contactTouched,
      nameEdit,
      companyEdit,
      emailEdit,
      deleteContact,
      toggleEditable,
      toggleDeletable,
      modal,
      handleConfirmDelete
    }

  }
})
</script>

<style lang="scss">
</style>
