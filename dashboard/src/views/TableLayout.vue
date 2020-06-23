<template>
  <section class="section table-section">
    <div class="table-container" :style="onlyTaskShown ? 'height: auto; padding: 0rem;' : ''">
      
      <div class="table-minimize-container message-table-minimize-container">
        <BaseMinimize
          :class-prop="'message-table-container'"
          :component-name="'Message Table'"
          @minimize-change="handleMinimize"
          
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
          :minimized="minimized[table.itemType]"
        >
          <BaseTableControls
            :item-type="table.itemType"
            :column-names="table.columnNames"
            :control-names="table.controlNames"
            @column-change="handleColumnChange"
            @control-change="handleControlChange"
          />
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
import BaseTableControls from './../components/table/BaseTableControls.vue'
import MessageTable from '../components/message/MessageTable.vue'

import { useModal } from '../composables/useModal'

import { Destination, IModal } from '../interfaces/common/modal.interface'
import { Tab } from '../interfaces/common/tab.interface'

import { useRouter } from 'vue-router'
import { colorLog } from '../utils'

export default defineComponent({
  name: 'TableLayout',
  props: {
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
    BaseTableControls,
    BaseTable,
    MessageTable
  },
  emits: [
    // TODO
      // ensure naming convention for emits
      // use handle if passing on event
      // otherwise if initiating event start with action verb 
    // #TODO
    'update-values',
    'update-messages',
    'handle-delete',
    'handle-toggle-delete',
    'handle-toggle-edit',
    'handle-input-edit',
    'handle-confirm-edit',
    'confirm-delete',
    'handle-edit-init',
    'handle-column-change',
    'handle-control-change',
  ],
  setup(props, ctx) {
    colorLog('table layout', 'green', 'yellow')
    console.log(props.tableItems)
    
    onUpdated(() => {
      // colorLog('on updated table layout', 'green', 'yellow')
      // console.log(props.taskEditRefs)
    })

    // const onlyTaskShown = ref(false)
    const onlyTaskShown = ref(true)
    const minimized = reactive({
      message: false,
      contact: true,
      task: true
    })
    const handleMinimize = (e) => {
      // could add boolean checks for component type to further modify behavior
      switch(e.componentName) {
        case 'message Table':
          minimized.message = e.minimized
          if (minimized.message == true && minimized.contact == true) onlyTaskShown.value = true
          else onlyTaskShown.value = false
          break
        case 'contact Table':
          minimized.contact = e.minimized
          if (minimized.message == true && minimized.contact == true) onlyTaskShown.value = true
          else onlyTaskShown.value = false
          break
        case 'task Table':
          minimized.task = e.minimized
          break
        break
      }
    }

    //#region openCard
      const editItemDestination: Destination = '#edit-item-modal'
      const itemEditModal = useModal(editItemDestination)

      const router = useRouter()
      const openCard = (_id) => {
        itemEditModal.showModal()
        router.push({ name: '#edit-item-modal', params: { id: _id } })
      }
      const cardIsOpen = computed(() => {
        return router.currentRoute.value.name === editItemDestination
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
      cardIsOpen,
      handleColumnChange: (e) => ctx.emit('handle-column-change', e),
      handleControlChange: (e) => ctx.emit('handle-control-change', e),
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
