<template>
  <section class="section table-section">
    <div class="table-container">
      <BaseBox class="contact-table-container">
        <ContactTable 
          :contacts="contacts"
          @update-contacts="onUpdateContacts"
      />  
      </BaseBox>
      <BaseBox class="task-table-container">
        <TaskTable
          :tasks="tasks"
          @update-tasks="onUpdateTasks"
        />
      </BaseBox>
    </div>

      <!-- <component :is="selectedComponent" @update-contacts="onUpdateContacts" @update-tasks="onUpdateTasks"/> -->
      <!-- <ContactTable :contacts="allContacts" @update-contacts="onUpdateContacts"/> -->
      <!-- <TaskTable :tasks="allTasks" @update-tasks="onUpdateTasks"/> -->
      <!-- <ContactTable @update-contacts="onUpdateContacts"/> -->
      <!-- <TaskTable  @update-tasks="onUpdateTasks"/> -->

  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

import BaseBox from './../components/common/BaseBox.vue'

import ContactTable from './../components/contacts/ContactTable.vue'
import TaskTable from './../components/task/TaskTable.vue'

import { useModal } from '../composables/useModal'
import { Destination } from '../interfaces/modal.interface'

import { Tab } from '../interfaces/tab.interface'

export default defineComponent({
  name: 'TableLayout',
  props: {
    contacts: {
      type: Array,
      required: true
    },
    tasks: {
      type: Array,
      required: true
    }
  },
  components: {
    BaseBox,
    ContactTable,
    TaskTable
  },
  emits: ['update-contacts', 'update-tasks'],
  setup(props, ctx) {
    const contactDestination: Destination = '#delete-contact-modal'
    const taskDestination: Destination = '#delete-task-modal'
    const contactModal = useModal(contactDestination)
    const taskModal = useModal(taskDestination)
    
    //#region dynamic component
      const tabs = ref<Tab[]>()
      const activeTab = ref<Tab>()

      tabs.value = [
        {id: 1, name: 'Contact', component: 'ContactTable'},
        {id: 2, name: 'Task', component: 'TaskTable'}
      ]

      activeTab.value = tabs.value[0];

      const tabChange = (e) => {
        console.log(e)
        activeTab.value = tabs.value.filter(t => t.name == e)[0]
      }

      const selectedComponent = computed(() => {
        console.log('selected component')
        console.log(activeTab.value.component)
        // switch(activeTab.value.component) {
        //   case 'TaskTable':
        //     return TaskTable
        //     break
        //   case 'ContactTable':
        //     return ContactTable
        // }
      })
    //#endregion

    const onUpdateContacts = () => {
      console.log('update contacts from create layout')
      ctx.emit('update-contacts')
    }
    const onUpdateTasks = () => {
      ctx.emit('update-tasks')
    }

    return {
      contactModal,
      taskModal,
      onUpdateContacts,
      onUpdateTasks
    }

  }
})
</script>

<style lang="scss">
</style>
