<template>
  <div class="card contact-card form-container">
    <div class="contact-card-header">
      <h5 class="form-heading">Contact</h5>
      <button class="delete is-pulled-right" @click="modal.hideModal"></button>
    </div>
    <hr class="form-hr"/>
    <form action="submit" @submit.prevent="submit">
      <BaseInput type="text" name="Name" v-model="name" />
      <BaseInput type="text" name="Company" v-model="company" />
      <BaseInput type="text" name="Email" v-model="email" />
      <button class="button is-success">Save</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

import BaseInput from './../../components/common/BaseInput.vue'

import { Contact } from '../../interfaces/contact.interface'

import useContact from '../../composables/useContact'
import { useModal } from '../../composables/useModal'
import { useStore } from './../../store'

export default defineComponent({
  name: 'ContactCard',

  props: {
    destination: {
      type: String,
      required: true
    }
  },

  components: {
    BaseInput
  },

  emits: ['update-contacts'],

  async setup(props, ctx){

    const name = ref('name')
    const company = ref('company')
    const email = ref('email')

    const nameEdit = ref() 
    const companyEdit = ref() 
    const emailEdit = ref()
    const contactTouched = ref(false)


    //#region modal
      const modal = useModal(props.destination)
    //#endregion

    //#region contactUse
      const store = useStore()
      const router = useRouter()
      const contactStore = store.modules['contactStore']
      console.log(router)
      // const contact = contactStore.getContactById()

    //#endregion

    const submit = async function(e: any) {
      console.log(props.destination)
      console.log(e)
    }

    const updateTable = () => {
    }

    return{
      name,
      company,
      email,
      submit,
      modal
    }

  }

})
</script>

<style lang="scss">
</style>
