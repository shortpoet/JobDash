<template>
  <div class="card contact-card form-container" v-if="loaded">
    <div class="contact-card-header">
      <h5 class="form-heading">Contact</h5>
      <button class="delete is-pulled-right" @click="handleModalClose"></button>
    </div>
    <hr class="form-hr"/>
    <form action="submit" @submit.prevent="submit">
      <BaseInput type="text" name="Id" :readonly="true" v-model="contactEdit._id" />
      <BaseInput type="text" name="Name" v-model="nameEdit" />
      <BaseInput type="text" name="Company" v-model="companyEdit" />
      <BaseInput type="text" name="Email" v-model="emailEdit" />
      <button class="button is-success">Save</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import moment from 'moment'

import { useRouter } from 'vue-router'
import { useStore } from './../../store'
import { ContactStore } from '../../store/contact.store'

import BaseInput from './../../components/common/BaseInput.vue'
import MessageWriter from './../../components/common/MessageWriter.vue'

import { Contact } from '../../interfaces/contact/contact.interface'

import { useModal } from '../../composables/useModal'
import { useUpdateValues } from '../../composables/useUpdateValues'

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

      const cardIsOpen = computed(() => {
        const open = router.currentRoute.value.name === props.destination
        // console.log('card is open')
        // console.log(open)
        return open
      })

    //#endregion

    // console.log('init contact card')
    if (cardIsOpen) {
      modal.showModal()
    }

    //#region initValues
      const store = useStore()
      const router = useRouter()
      const contactStore: ContactStore = store.modules['contactStore']

      const id = ref()
      const contact = ref<Contact>()

      const contactEdit = ref<Contact>()
      const loaded = ref(false)

      const nameEdit = ref() 
      const companyEdit = ref() 
      const emailEdit = ref()
      const contactTouched = ref(false)
      const handleModalClose = () => {modal.hideModal(); router.push('/')}

      setTimeout(() => {
        id.value = typeof(router.currentRoute.value.params.id) == 'string' ? router.currentRoute.value.params.id : router.currentRoute.value.params.id[0]
        contact.value = contactStore.getRecordById(id.value)
        nameEdit.value = contact.value.name
        companyEdit.value = contact.value.company
        emailEdit.value = contact.value.email
        contactEdit.value = {...contact.value}
        loaded.value = true
      }, .1)
    
    //#region updateValues
      useUpdateValues(contactTouched, [nameEdit, companyEdit, emailEdit])

      const submit = async function(e: any) {
        if (contactTouched.value == true) {
          contactEdit.value.name = nameEdit.value
          contactEdit.value.company = companyEdit.value
          contactEdit.value.email = emailEdit.value
          await contactStore.editRecord(
            contact.value, 
            contactEdit.value
          )
          contactTouched.value = false
          ctx.emit('update-contacts')
        }
        handleModalClose()
      }
    //#endregion

    return{
      contactEdit,
      nameEdit,
      companyEdit,
      emailEdit,
      submit,
      modal,
      loaded,
      cardIsOpen,
      handleModalClose
    }

  }

})
</script>

<style lang="scss">
</style>
