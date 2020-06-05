<template>
  <table class="table is-hoverable">
    <thead>
      <tr>
        <th>Name</th>
        <th>Company</th>
        <th>Email</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tr
      v-for="contact in allContacts"
      :key="contact._id"    
    >
      <td>{{ contact.name }}</td>
      <td>{{ contact.company }}</td>
      <td>{{ contact.email }}</td>
      <td style="color: red; text-align: center; cursor: pointer" @click="deleteContact(contact)">🗑</td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from './../../store'
import BaseInput from './../../components/common/BaseInput.vue'
import { Contact } from '../../interfaces/contact.interface'
import moment from 'moment'
export default defineComponent({
  name: 'ContactTable',

  components: {
    BaseInput
  },


  async setup(props, ctx){

    const store = useStore()

    // console.log(store)

    if (!store.getState().contacts.loaded) {
      await store.fetchContacts()
    }

    const allContacts = store.getState().contacts.ids.reduce<Contact[]>((accumulator, id) => {
      const post = store.getState().contacts.all[id]
      return accumulator.concat(post)
    }, [])

    console.log(allContacts)

    const deleteContact = (contact: Contact) => {
      store.deleteContact(contact)
    }

    return{
      deleteContact,
      allContacts
    }

  }

})
</script>

<style lang="scss">
</style>
