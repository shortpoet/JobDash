<template>
  <table class="table is-hoverable">
    <thead>
      <tr>
        <th>Name</th>
        <th>Company</th>
        <th>Email</th>
        <th>Delete</th>
        <th>Edit</th>
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

      <td v-if="contact.editable" contenteditable>{{ contact.name }}</td>
      <td v-else>{{ contact.name }}</td>

      <td v-if="contact.editable" contenteditable>{{ contact.company }}</td>
      <td v-else>{{ contact.company }}</td>

      <td v-if="contact.editable" contenteditable>{{ contact.email }}</td>
      <td v-else>{{ contact.email }}</td>

      <td style="color: red; text-align: center; cursor: pointer" @click="deleteContact(contact)">🗑</td>

      <td style="text-align: center; cursor: pointer" @click="makeEditable(contact)">📝</td>

    </tr>
  </table>
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
import { Contact } from '../../interfaces/contact.interface'
import moment from 'moment'
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
  },

  emits: ['update-contacts'],

  async setup(props, ctx){
    const store = useStore()

    const updateContacts = () => {
      ctx.emit('update-contacts')
    }

    const deleteContact = async (contact: Contact) => {
      await store.deleteContact(contact)
      console.log('delete contact')
      ctx.emit('update-contacts')
    }
    
    const makeEditable = (contact: Contact) => {
      store.toggleEditable(contact, true)
    }

    return {
      updateContacts,
      deleteContact,
      makeEditable
    }

  }

})
</script>

<style lang="scss">
</style>
