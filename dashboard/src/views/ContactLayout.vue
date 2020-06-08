<template>
  <div class="columns">
    <div class="column is-one-half">      
      <ContactCreate @update-contacts="onUpdateContacts"/>
    </div>
    <div class="column is-one-half">
      <ContactTable :contacts="allContacts" @update-contacts="onUpdateContacts"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

import BaseModal from './../components/common/BaseModal.vue'

import ContactCreate from './../components/contacts/ContactCreate.vue'

import ContactTable from './../components/contacts/ContactTable.vue'


import { Destination } from '../interfaces/modal.interface'
import { Contact } from '../interfaces/contact.interface'

import { useModal } from '../composables/useModal'
import useContact from '../composables/useContact'
import { useContactStore, IContactStore } from '../store/contact.store'


export default defineComponent({
  name: 'MainLayout',

  components: {
    BaseModal,
    ContactCreate,
    ContactTable
  },
  async setup(props, ctx) {
    const contactDestination: Destination = '#delete-contact-modal'
    const taskDestination: Destination = '#delete-task-modal'
    const contactModal = useModal(contactDestination)


    //#region contacts
      const contactStore = useContactStore()
  
      const iContactStore: IContactStore = {
        contactStore: contactStore
      }

      const allContacts = ref<Contact[]>([])

      const contactUse = await useContact(iContactStore, allContacts)

      const onUpdateContacts = contactUse.onUpdateContacts
    //#endregion


    return {
      contactModal,
      allContacts,
      onUpdateContacts
    }

  }
})
</script>

<style lang="scss">
</style>
