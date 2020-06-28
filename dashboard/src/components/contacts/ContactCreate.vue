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
import moment from 'moment'

import { ContactStore } from './../../store/contact.store'

import BaseInput from './../../components/common/BaseInput.vue'

import { IContact } from '../../interfaces/contact/contact.interface'

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
      const contactStore: ContactStore = store.modules['contactStore']

    //#endregion

    const submit = async function(e: any) {
      // console.log(store.getLastId())
      const nextId = (parseInt(contactStore.getLastId()) + 1).toString()
      const contact: IContact = {
        _id: nextId,
        itemId: nextId,
        name: name.value,
        company: company.value,
        email: email.value,
        created: moment(),
        edited: moment(),
        editable: false,
        locked: true
      }
      await contactStore.createRecord(contact)
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
