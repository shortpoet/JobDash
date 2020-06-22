<template>
  <section class="section table-section">
    <div class="table-container" :style="onlyTaskShown ? 'height: auto; padding: 0rem;' : ''">
      
      <div class="table-minimize-container message-table-minimize-container">
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
      </div>

      <div class="table-minimize-container task-table-minimize-container">
        <BaseMinimize
          v-for="table in tableItems"
          :class-prop="`${table.itemType}-table-container`"
          :component-name="`${table.itemType} Table`"
          @minimize-change="handleMinimize"
        >
          <BaseBox scrollable>
            <BaseTable
              :items="table.items"
              :id-symbol="table.idSymbol"
              :item-type="table.itemType"
              :edit-modal="editModal"
              :delete-modal="deleteModal"
              @handle-delete="handleDelete"
              @handle-toggle-delete="handleToggleDelete"
              @handle-toggle-edit="handleToggleEdit"
              @handle-confirm-edit="handleConfirmEdit"
              @handle-input-edit="handleInputEdit"
              @confirm-delete="confirmDelete"
              :item-under-edit="itemUnderEdit"
            />
          </BaseBox>
        </BaseMinimize>
      </div>


      <!-- <div class="table-minimize-container contact-table-minimize-container">
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
      </div> -->

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
import { defineComponent, computed, ref, reactive, onUpdated } from 'vue'
import BaseMinimize from '../components/common/BaseMinimize.vue'

import BaseBox from './../components/common/BaseBox.vue'
import BaseTable from './../components/table/BaseTable.vue'
import ContactTable from './../components/contacts/ContactTable.vue'
import TaskTable from './../components/task/TaskTable.vue'
import ContactCard from './../components/contacts/ContactCard.vue'
import MessageTable from '../components/message/MessageTable.vue'

import { useModal } from '../composables/useModal'

import { Destination, IModal } from '../interfaces/common/modal.interface'
import { Tab } from '../interfaces/common/tab.interface'

import { useRouter } from 'vue-router'
import { colorLog } from '../utils'

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
    },
    tableItems: {
      type: Array as () => object[],
      // required: true
    },
    deleteModal: {
      type: Object as () => IModal
    },
    editModal: {
      type: Object as () => IModal
    },
    itemUnderEdit: {
      type: Object,
      required: false
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
  emits: [
    'update-values',
    'update-contacts',
    'update-tasks',
    'update-messages',
    'handle-delete',
    'handle-toggle-delete',
    'handle-toggle-edit',
    'handle-input-edit',
    'handle-confirm-edit',
    'confirm-delete',
    'handle-edit-init'
  ],
  setup(props, ctx) {
    const contactDestination: Destination = '#delete-contact-modal'
    const taskDestination: Destination = '#delete-task-modal'
    const contactModal = useModal(contactDestination)
    const taskModal = useModal(taskDestination)
    colorLog('table layout', 'green', 'yellow')
    console.log(props.tableItems)
    
    onUpdated(() => {
      // colorLog('on updated table layout', 'green', 'yellow')
      // console.log(props.taskEditRefs)
    })

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
      const editItemDestination: Destination = '#edit-item-modal'
      const itemEditModal = useModal(editItemDestination)

      const router = useRouter()
      const openCard = (_id) => {
        itemEditModal.showModal()
        router.push({ name: '#edit-item-modal', params: { id: _id } })
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

    return {
      minimized,
      onlyTaskShown,
      handleMinimize,
      contactModal,
      taskModal,
      cardIsOpen,
      handleToggleEdit: (e) => ctx.emit('handle-toggle-edit', e),
      handleConfirmEdit: (e) => ctx.emit('handle-confirm-edit', e),
      handleInputEdit: (e) => ctx.emit('handle-input-edit', e),
      handleToggleDelete: (e) => ctx.emit('handle-toggle-delete', e),
      handleDelete: (item) => ctx.emit('handle-delete', item),
      confirmDelete: (item) => ctx.emit('confirm-delete', item),
    }

  }
})
</script>

<style lang="scss">
</style>
