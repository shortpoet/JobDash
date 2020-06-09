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

  async setup(props, ctx){

    const name = ref('name')
    const company = ref('company')
    const email = ref('email')

    const store = useStore()
    console.log(store)

    //#region contactUse
      const contactStore = useContactStore()
      const contactStoreModule = store.modules['contactStore']

      console.log(contactStore)
      console.log(contactStoreModule)
  
      const allContacts = ref<Contact[]>([])
      const allContactsModule = ref<Contact[]>([])

      // const contactUse = await useContact(contactStore, allContacts)
      const contactUseModule = await useContact(contactStoreModule, allContactsModule)

      console.log(allContacts.value)
      console.log(allContactsModule.value)

      // const onUpdateContacts = contactUse.onUpdateContacts
      const onUpdateContactsModule = contactUseModule.onUpdateContacts
    //#endregion

    const submit = async function(e: any) {
      // console.log(store.getLastId())
      const nextId = (parseInt(contactStore.getLastId()) + 1).toString()
      const nextIdModule = (parseInt(contactStoreModule.getLastId()) + 1).toString()
      console.log(nextId)
      console.log(nextIdModule)
      const contact: Contact = {
        _id: nextIdModule,
        name: name.value,
        company: company.value,
        email: email.value,
        created: moment(),
        edited: moment(),
        editable: false,
        locked: true
      }
      console.log(contact)
      await contactStoreModule.createContact(contact)
      console.log('create contact')
      ctx.emit('update-contacts')
      onUpdateContactsModule()
    }

    const updateTable = () => {
    }

    return{
      name,
      company,
      email,
      submit,
      // onUpdateContacts
    }

  }

})
</script>

<style lang="scss">
</style>
