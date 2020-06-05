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
      v-for="contact in contacts"
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

  props: {
    contacts: {
      type: Array,
      required: true
    }
  },

  components: {
    BaseInput
  },


  async setup(props, ctx){
    const store = useStore()
    const deleteContact = async (contact: Contact) => {
      await store.deleteContact(contact)
      console.log('delete contact')
      ctx.emit('update-contacts')
    }

    return {
      deleteContact
    }

  }

})
</script>

<style lang="scss">
</style>
