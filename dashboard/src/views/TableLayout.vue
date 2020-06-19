<template>
  <section class="section table-section">
    <div class="table-container" :style="onlyTaskShown ? 'height: auto; padding: 0rem;' : ''">

      <!-- <div class="table-minimize-container message-table-minimize-container">
        <BaseMinimize
          :class-prop="'message-table-container'"
          :component-name="'Message Table'"
          @minimize-change="handleMinimize"
          minimized
        >
          <BaseBox scrollable>
            <MessageTable 
              :messages="messages" 
              @update-messages="onUpdateMessages"
            />
          </BaseBox>
        </BaseMinimize>
      </div> -->

      <div class="table-minimize-container contact-table-minimize-container">
        <BaseMinimize
          :class-prop="'contact-table-container'"
          :component-name="'Contact Table'"
          @minimize-change="handleMinimize"
        >
          <BaseBox scrollable>
            <ContactTable 
              :contacts="contacts"
              @update-contacts="onUpdateContacts"
          />  
          </BaseBox>
        </BaseMinimize>
      </div>

      <!-- <div class="table-minimize-container task-table-minimize-container">
        <BaseMinimize
          :class-prop="'task-table-container'"
          :component-name="'Task Table'"
          @minimize-change="handleMinimize"
        >
          <BaseBox scrollable>
            <TaskTable
              :tasks="tasks"
              @update-tasks="onUpdateTasks"
            />
          </BaseBox>
        </BaseMinimize>
      </div>
 -->
      <div class="table-minimize-container task-table-minimize-container">
        <BaseMinimize
          :class-prop="'task-table-container'"
          :component-name="'Task Table'"
          @minimize-change="handleMinimize"
        >
          <BaseBox scrollable>
            <BaseTable
              :items="tasks"
              :id-symbol="'_id'"
              :item-type="'task'"
              @update-values="onUpdateTasks"
            />
          </BaseBox>
        </BaseMinimize>
      </div>

    </div>

    <!-- 
      Errors:
        - Failed to locate Teleport target with selector "#contact-card-modal". 
        - Invalid Teleport target on mount: null
      when using the computed value.  i guess it tries to compute before dom is available
    <teleport to="#contact-card-modal" v-if="cardIsOpen">
      <router-view/>
      <ContactCard @save-item="'editContact'" :destination="'#contact-card-modal'"/>
    </teleport> 
    -->

      <!-- <component :is="selectedComponent" @update-contacts="onUpdateContacts" @update-tasks="onUpdateTasks"/> -->
      <!-- <ContactTable :contacts="allContacts" @update-contacts="onUpdateContacts"/> -->
      <!-- <TaskTable :tasks="allTasks" @update-tasks="onUpdateTasks"/> -->
      <!-- <ContactTable @update-contacts="onUpdateContacts"/> -->
      <!-- <TaskTable  @update-tasks="onUpdateTasks"/> -->

  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive } from 'vue'
import BaseMinimize from '../components/common/BaseMinimize.vue'

import BaseBox from './../components/common/BaseBox.vue'
import BaseTable from './../components/table/BaseTable.vue'
import ContactTable from './../components/contacts/ContactTable.vue'
import TaskTable from './../components/task/TaskTable.vue'
import ContactCard from './../components/contacts/ContactCard.vue'
import MessageTable from '../components/message/MessageTable.vue'

import { useModal } from '../composables/useModal'

import { Destination } from '../interfaces/common/modal.interface'
import { Tab } from '../interfaces/common/tab.interface'

import { useRouter } from 'vue-router'

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
    },
    messages: {
      type: Array,
      required: true
    }
  },
  components: {
    BaseMinimize,
    BaseBox,
    BaseTable,
    ContactTable,
    TaskTable,
    ContactCard,
    MessageTable
  },
  emits: ['update-contacts', 'update-tasks', 'update-messages'],
  setup(props, ctx) {
    const contactDestination: Destination = '#delete-contact-modal'
    const taskDestination: Destination = '#delete-task-modal'
    const contactModal = useModal(contactDestination)
    const taskModal = useModal(taskDestination)
    
    // const onlyTaskShown = ref(false)
    const onlyTaskShown = ref(true)
    const minimized = reactive({
      messageTable: true,
      contactTable: false,
      taskTable: false
    })
    const handleMinimize = (e) => {
      // could add boolean checks for component type to further modify behavior
      switch(e.componentName) {
        case 'Message Table':
          minimized.messageTable = e.minimized
          if (minimized.messageTable == true && minimized.contactTable == true) onlyTaskShown.value = true
          else onlyTaskShown.value = false
          break
        case 'Contact Table':
          minimized.contactTable = e.minimized
          if (minimized.messageTable == true && minimized.contactTable == true) onlyTaskShown.value = true
          else onlyTaskShown.value = false
          break
        case 'Task Table':
          minimized.taskTable = e.minimized
          break
        break
      }
    }

    //#region contactCardModal
      const contactCardDestination: Destination = '#contact-card-modal'

      const contactCardModal = useModal(contactCardDestination)
    //#endregion

    //#region openCard
      const router = useRouter()
      const openCard = (_id) => {
        contactCardModal.showModal()
        router.push({ name: '#contact-card-modal', params: { id: _id } })
      }
      const cardIsOpen = computed(() => {
        return router.currentRoute.value.name === contactCardDestination
      })
    //#endregion
    

    //#region dynamic component
      const tabs = ref<Tab[]>()
      const activeTab = ref<Tab>()

      tabs.value = [
        {id: 1, name: 'Contact', component: 'ContactTable'},
        {id: 2, name: 'Task', component: 'TaskTable'}
      ]

      activeTab.value = tabs.value[0];

      const tabChange = (e) => {
        // console.log(e)
        activeTab.value = tabs.value.filter(t => t.name == e)[0]
      }

      const selectedComponent = computed(() => {
        // console.log('selected component')
        // console.log(activeTab.value.component)
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
      ctx.emit('update-contacts')
    }
    const onUpdateTasks = () => {
      ctx.emit('update-tasks')
    }
    const onUpdateMessages = () => {
      ctx.emit('update-messages')
    }

    return {
      minimized,
      onlyTaskShown,
      handleMinimize,
      contactModal,
      taskModal,
      cardIsOpen,
      onUpdateContacts,
      onUpdateTasks
    }

  }
})
</script>

<style lang="scss">
</style>
