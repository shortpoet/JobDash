<template>
  <td>{{ contact.name }}</td>
  <td>{{ contact.company }}</td>
  <td>{{ contact.email }}</td>
  <td style="color: red; text-align: center; cursor: pointer" @click="deleteContact(contact)">🗑</td>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useContactStore } from './../../store/contact.store'
import BaseInput from './../../components/common/BaseInput.vue'
import { Contact } from '../../interfaces/contact.interface'
import moment from 'moment'
export default defineComponent({
  name: 'ContactTable',

  props: {
    contact: {
      type: Object,
      required: true
    }
  },

  components: {
    BaseInput
  },

  emits: ['update-contacts'],

  async setup(props, ctx){
    const contactStore = useContactStore()
    const deleteContact = async (contact: Contact) => {
      await contactStore.deleteContact(contact)
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
