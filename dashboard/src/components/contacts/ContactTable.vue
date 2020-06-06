<template>
  <table class="table is-hoverable">
    <thead>
      <tr>
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
    >
    
      <!--
        Using a component here creates a bug
      -->

      <!-- <ContactRow :contact="contact" @update-contacts="updateContacts" /> -->

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

      <td style="color: red; text-align: center; cursor: pointer" @click="handleConfirmDelete(contact)">🗑</td>

      <td style="text-align: center; cursor: pointer" @click="toggleEditable(contact)">📝</td>

      <td v-if="contact.locked" style="text-align: center; cursor: pointer" @click="toggleDeletable(contact)">🔒</td>
      <td v-else style="text-align: center; cursor: pointer" @click="toggleDeletable(contact)">🔓</td>

    </tr>
  </table>
  <teleport to="#modal-warning" v-if="modal.visible">
    <ModalWarning @delete-contact="deleteContact"/>
  </teleport>
    <!-- <Suspense>
      <template #default>

      </template>
      <template #fallback>

      </template>
    </Suspense> -->
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from './../../store'
import ContactRow from './../../components/contacts/ContactRow.vue'
import BaseInput from './../../components/common/BaseInput.vue'
import ModalWarning from './../../components/common/ModalWarning.vue'
import { Contact } from '../../interfaces/contact.interface'
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
    ModalWarning
  },

  emits: ['update-contacts'],

  async setup(props, ctx){

    const nameEdit = ref()
    const companyEdit = ref()
    const emailEdit = ref()
    const confirmDelete = ref(false)
    const deleteCandidate = ref<Contact>(null)

    const store = useStore()

    const modal = useModal()

    const updateContacts = () => {
      ctx.emit('update-contacts')
    }

    const handleConfirmDelete = (contact: Contact) => {
      if (contact.locked) {
        deleteCandidate.value = contact
        modal.showModal()
      } else {
        deleteCandidate.value = contact
        deleteContact()
      }
    }
    
    // confirmDelete.value === true ? false : true

    const deleteContact = async () => {
      modal.hideModal()
      const deletedId = await store.deleteContact(deleteCandidate.value)
      console.log('delete contact')
      console.log(deletedId)
      deleteCandidate.value._id == deletedId ? deleteCandidate.value = null : ''
      console.log(deleteCandidate.value)
      ctx.emit('update-contacts')
    }
    
    const toggleEditable = async (oldContact: Contact) => {
      if (oldContact.editable == false) {
        store.toggleEditable(oldContact, true)
        nameEdit.value = oldContact.name
        companyEdit.value = oldContact.company
        emailEdit.value = oldContact.email
      } else {

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

        await store.editContact(
          oldContact, 
          newContact
        )
        // this closes the edit window by updating the refs after newContact editable set to false
        ctx.emit('update-contacts')
      }
    }

    const toggleDeletable = async (contact: Contact) => {
      console.log(contact.locked)
      if (contact.locked == false) {
        store.toggleDeletable(contact, true)
      } else {
        store.toggleDeletable(contact, false)
        // this closes the edit window by updating the refs after newContact editable set to false
        ctx.emit('update-contacts')
      }
      console.log(contact.locked)
    }

    return {
      nameEdit,
      companyEdit,
      emailEdit,
      updateContacts,
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
