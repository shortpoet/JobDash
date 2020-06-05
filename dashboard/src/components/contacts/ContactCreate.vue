<template>
  <div class="columns">
    <div class="column is-one-half">
      <form action="submit" @submit.prevent="submit">
        <BaseInput type="text" name="Name" v-model="name" />
        <BaseInput type="text" name="Company" v-model="company" />
        <BaseInput type="text" name="Email" v-model="email" />
        <button class="button is-success">Create</button>
      </form>
    </div>
    <div class="column is-one-half"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from './../../store'
import BaseInput from './../../components/common/BaseInput.vue'
import { Contact } from '../../interfaces/contact.interface'
import moment from 'moment'
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


    const submit = async function(e: any) {
      // console.log(store.getLastId())
      const nextId = (parseInt(store.getLastId()) + 1).toString()
      // console.log(nextId)
      const contact: Contact = {
        _id: nextId,
        name: name.value,
        company: company.value,
        email: email.value,
        created: moment(),
        editable: false
      }
      await store.createContact(contact)
      console.log('create contact')
      ctx.emit('update-contacts')
    }

    const updateTable = () => {
    }

    return{
      name,
      company,
      email,
      submit
    }

  }

})
</script>

<style lang="scss">
</style>
