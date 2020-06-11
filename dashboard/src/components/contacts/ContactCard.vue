<template>
  <div class="card contact-card form-container">
    <div class="contact-card-header">
      <h5 class="form-heading">Contact</h5>
      <button class="delete is-pulled-right" @click="modal.hideModal"></button>
    </div>
    <hr class="form-hr"/>
    <form action="submit" @submit.prevent="submit">
      <BaseInput type="text" name="Name" v-model="nameEdit" />
      <BaseInput type="text" name="Company" v-model="companyEdit" />
      <BaseInput type="text" name="Email" v-model="emailEdit" />
      <button class="button is-success">Save</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

import BaseInput from './../../components/common/BaseInput.vue'

import MessageWriter from './../../components/common/MessageWriter.vue'

import { Contact } from '../../interfaces/contact.interface'

import useContact from '../../composables/useContact'
import { useModal } from '../../composables/useModal'
import { useUpdateValues } from '../../composables/useUpdateValues'
import { useStore } from './../../store'
import { ContactStore } from '../../store/contact.store'

export default defineComponent({
  name: 'ContactCard',

  props: {
    destination: {
      type: String,
      required: true
    }
  },

  components: {
    BaseInput,
    MessageWriter
  },

  emits: ['update-contacts'],

  async setup(props, ctx){

    //#region modal
      const modal = useModal(props.destination)
    //#endregion

    //#region contactUse
      const store = useStore()
      const router = useRouter()
      const contactStore: ContactStore = store.modules['contactStore']
      const id: string = typeof(router.currentRoute.value.params.id) == 'string' ? router.currentRoute.value.params.id : router.currentRoute.value.params.id[0]
      const contact: Contact = contactStore.getRecordById(id)

      console.log(router)
      // const contact = contactStore.getContactById()

    //#endregion
    //#region initValues
      const nameEdit = ref() 
      const companyEdit = ref() 
      const emailEdit = ref()
      const contactTouched = ref(false)

      nameEdit.value = contact.name
      companyEdit.value = contact.company
      emailEdit.value = contact.email

      const contactEdit = ref<Contact>({...contact})


    //#endregion
    
    //#region updateValues
      useUpdateValues(contactTouched, [nameEdit, companyEdit, emailEdit])
    //#endregion

    const submit = async function(e: any) {
      if (contactTouched.value == true) {
        contactEdit.value.name = nameEdit.value
        contactEdit.value.company = companyEdit.value
        contactEdit.value.email = emailEdit.value
        await contactStore.editRecord(
          contact, 
          contactEdit.value,
          '_id'
        )
        contactTouched.value = false
        ctx.emit('update-contacts')
      }
      modal.hideModal()
    }

    const updateTable = () => {
    }

    return{
      nameEdit,
      companyEdit,
      emailEdit,
      submit,
      modal
    }

  }

})
</script>

<style lang="scss">
</style>
