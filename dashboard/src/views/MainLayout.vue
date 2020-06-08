<template>

  <BaseModal :isActive="taskModal.visible" :destination="'#delete-task-modal'">
    <template #destination>
      <div class="" id="delete-task-modal">
      </div>
    </template>
  </BaseModal>
  <BaseModal :isActive="contactModal.visible" :destination="'#delete-contact-modal'">
    <template #destination>
      <div class="" id="delete-contact-modal">
      </div>
    </template>
  </BaseModal>

  <div class="columns">
    <div class="column is-one-half">
      <ContactCreate />
      <TaskCreate />
    </div>
    <div class="column is-one-half">
      <!-- <ContactBoard /> -->
      <ContactTable :contacts="allContacts" @update-contacts="onUpdateContacts"/>
      <TaskTable :tasks="allTasks" @update-tasks="onUpdateTasks"/>
    </div>
  </div>

  <TaskBoard />

  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

import BaseModal from './../components/common/BaseModal.vue'

import ContactCreate from './../components/contacts/ContactCreate.vue'
import TaskCreate from './../components/task/TaskCreate.vue'

import ContactTable from './../components/contacts/ContactTable.vue'
import TaskTable from './../components/task/TaskTable.vue'

// import ContactBoard from './ContactBoard.vue'

import TaskBoard from './TaskBoard.vue'

import { Destination } from '../interfaces/modal.interface'
import { Contact } from '../interfaces/contact.interface'

import { useModal } from '../composables/useModal'
import useContact from '../composables/useContact'

import { Task } from '../interfaces/task.interface'
import useTask from '../composables/useTask'

export default defineComponent({
  name: 'MainLayout',

  components: {
    BaseModal,
    ContactCreate,
    TaskCreate,
    ContactTable,
    TaskTable,
    // ContactBoard,
    TaskBoard
  },
  async setup(props, ctx) {
    const contactDestination: Destination = '#delete-contact-modal'
    const taskDestination: Destination = '#delete-task-modal'
    const contactModal = useModal(contactDestination)
    const taskModal = useModal(taskDestination)

    console.log('task modal', taskModal)

    //#region contacts
      const allContacts = ref<Contact[]>([])

      const contactUse = await useContact(allContacts)

      const onUpdateContacts = contactUse.onUpdateContacts
    //#endregion


    //#region tasks
      const allTasks = ref<Task[]>([])

      // is this correct usage of provide/inject
      const taskUse = await useTask(allTasks)

      const onUpdateTasks = taskUse.onUpdateTasks
    //#endregion



    return {
      contactModal,
      taskModal,
      allContacts,
      onUpdateContacts,
      allTasks,
      onUpdateTasks
    }

  }
})
</script>

<style lang="scss">
</style>
