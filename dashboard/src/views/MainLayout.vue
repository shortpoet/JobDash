<template>

  <ModalLayout />

  <div class="columns">
    <div class="column is-two-fifths">
      <CreateLayout
        @update-contacts="onUpdateContacts"    
        @update-tasks="onUpdateTasks"
      />
      <!-- <TabsLayout @tab-change="tabChange"/> -->
    </div>
    <div class="column is-one-half">
      <TableLayout
        :contacts="allContacts"
        @update-contacts="onUpdateContacts"
        :tasks="allTasks"
        @update-tasks="onUpdateTasks"
    />
    </div>
  </div>

  <TaskBoard
    :tasks="allTasks"
  />

  <!-- 
    causes append child node error
  <teleport to="#contact-card-modal" v-if="contactCardModal.visible">
    <router-view/>
    <ContactCard @save-item="editContact" :destination="'#contact-card-modal'"/>
  </teleport> 
  -->


  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

import ModalLayout from './ModalLayout.vue'

import ContactCard from './../components/contacts/ContactCard.vue'

import CreateLayout from './CreateLayout.vue'
import TableLayout from './TableLayout.vue'

import TaskBoard from './TaskBoard.vue'

import { Destination } from '../interfaces/modal.interface'
import { useModal } from '../composables/useModal'
import { useStore } from '../store'
import { Contact } from '../interfaces/contact.interface'
import useContact from '../composables/useContact'
import { Task } from '../interfaces/task.interface'
import useTask from '../composables/useTask'

export default defineComponent({
  name: 'MainLayout',

  components: {
    ModalLayout,
    CreateLayout,
    TableLayout,
    TaskBoard,
    ContactCard
  },
  async setup(props, ctx) {

    const contactCardDestination: Destination = '#contact-card-modal'

    const contactCardModal = useModal(contactCardDestination)


    //#region contactUse
      const store = useStore()
      const contactStore = store.modules['contactStore']

      const allContacts = ref<Contact[]>([])

      const contactUse = await useContact(contactStore, allContacts)

      const onUpdateContacts = contactUse.onUpdateContacts
    //#endregion
    
    //#region taskUse
      const taskStore = store.modules['taskStore']

      // const iTaskStore: ITaskStore = {
      //   taskStore: taskStore
      // }

      const allTasks = ref<Task[]>([])

      // is this correct usage of provide/inject
      // const taskUse = await useTask(iTaskStore, allTasks)
      const taskUse = await useTask(taskStore, allTasks)

      const onUpdateTasks = taskUse.onUpdateTasks
    //#endregion


    return {
      contactCardModal,
      allContacts,
      allTasks,
      onUpdateContacts,
      onUpdateTasks
    }

  }
})
</script>

<style lang="scss">
</style>
