<template>
  <div class="form-container">
    <h5 class="form-heading">Contact</h5>
    <hr class="form-hr"/>
    <form action="submit" @submit.prevent="submit">
      <BaseInput type="text" name="Name" v-model="name" />
      <BaseInput type="text" name="Company" v-model="company" />
      <BaseInput type="text" name="Email" v-model="email" />
      <button class="button is-success">Create</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useContactStore, IContactStore } from './../../store/contact.store'
import BaseInput from './../../components/common/BaseInput.vue'
import { Contact } from '../../interfaces/contact.interface'
import moment from 'moment'
import useContact from '../../composables/useContact'

import {useStore} from './../../store'

export default defineComponent({
  name: 'ContactCreate',

  components: {
    BaseInput
  },

  emits: ['update-contacts'],

  async setup(props, ctx){

    const name = ref('name')
    const company = ref('company')
    const email = ref('email')


    //#region contactUse
      const store = useStore()
      const contactStore = store.modules['contactStore']

      const allContacts = ref<Contact[]>([])

      const contactUse = await useContact(contactStore, allContacts)

      const onUpdateContacts = contactUse.onUpdateContacts
    //#endregion

    const submit = async function(e: any) {
      // console.log(store.getLastId())
      const nextId = (parseInt(contactStore.getLastId()) + 1).toString()
      console.log(nextId)
      const contact: Contact = {
        _id: nextId,
        name: name.value,
        company: company.value,
        email: email.value,
        created: moment(),
        edited: moment(),
        editable: false,
        locked: true
      }
      // console.log(contact)
      await contactStore.createContact(contact)
      console.log('create contact')
      ctx.emit('update-contacts')
      // onUpdateContacts()
    }

    const updateTable = () => {
    }

    return{
      name,
      company,
      email,
      submit,
    }

  }

})
</script>

<style lang="scss">
</style>
