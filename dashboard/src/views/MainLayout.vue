<template>

  <!-- 
    <div class="main-layout" v-if="targetsLoadedRef">
    might not need this v-if after all but that random progress bar multiplying bug still happens
  -->
  <div class="main-layout" >
    <BaseMinimize
      :class-prop="'columns'"
      :component-name="'Create and Tables'"
    >
      <div class="column tabs-column">
        <CreateLayout
          @update-contacts="onUpdateContacts"    
          @update-tasks="onUpdateTasks"
        />
        <!-- <TabsLayout @tab-change="tabChange"/> -->
      </div>
      <div class="column">
        <TableLayout
          v-for="(table, i) in tables"
          :destination="editItemDestination"
          :column-names="table.columnNames"
          :items="table.items"
          :item-type="table.itemType"
          :id-symbol="table.idSymbol"
          :store="table.store"
          :delete-confirm="deleteConfirm"
          @update-values="onUpdateValues"
        />
      </div>
    </BaseMinimize>

    <!-- <BoardLayout
      :items="allTasks"
      :active-board="activeBoard"
    /> -->
  </div>

  <teleport :to="`#delete-item-modal`" v-if="itemDeleteModal.visible">
    <ModalWarning @delete-item="confirmDelete" :destination="`#delete-item-modal`" />
  </teleport>

  <!-- <teleport :to="`#edit-item-modal`" v-if="itemEditModal.visible">
    <BaseItemEditCard
      @modal-confirm-edit="modalConfirmEdit"
      :editable-columns="editableColumnsComputed"
      :destination="editItemDestination"
    />
  </teleport> -->
  
  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, nextTick, onUpdated, reactive, toRefs, Ref, isRef } from 'vue'

import CreateLayout from './CreateLayout.vue'
import BoardLayout from './BoardLayout.vue'
import BaseMinimize from '../components/common/BaseMinimize.vue'
import { onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { useStore, ITEMS_ID_SYMBOL, TABLE_STORE_LOCAL_SYMBOL, CONTACT_STORE_SYMBOL, CONTACT_ID_SYMBOL, TASK_STORE_SYMBOL, MESSAGE_STORE_SYMBOL, TASK_ID_SYMBOL, MESSAGE_ID_SYMBOL } from '../store'

import { useModal } from '../composables/useModal'
import BaseItemEditCard from './../components/common/BaseItemEditCard.vue'
import ModalWarning from './../components/common/ModalWarning.vue'


import TableLayout from './TableLayout.vue'


import { Destination } from '../interfaces/common/modal.interface'
import { Contact } from '../interfaces/contact/contact.interface'
import { Task } from '../interfaces/task/task.interface'
import { BoardStore } from '../store/board.store'
import { IBoardColumn } from '../interfaces/board/board.column.interface'
import useBoard from '../composables/useBoard'
import { useDelete } from '../composables/table/useDelete'
import { useEdit } from '../composables/table/useEdit'
import { useInitEdit } from '../composables/table/useInitEdit'
import { colorLog } from '../utils'
import { ContactStore } from '../store/contact.store'
import { taskProps, taskData, contactData, contactProps, messageProps, messageData } from './columns'
import { taskControls, contactControls, messageControls } from './controls'
import { TableConfig } from '../interfaces/table/table.interface'
import { TaskStore } from '../store/task.store'
import { MessageStore } from '../store/message.store'
import { Message } from '../interfaces/message/message.interface'

export default defineComponent({
  name: 'MainLayout',

  components: {
    BaseMinimize,
    CreateLayout,
    TableLayout,
    BoardLayout,
    ModalWarning,
    BaseItemEditCard
  },
  emits: ['confirm-delete'],
  async setup(props, ctx) {

    const activeBoard = ref('1')
    const handleActiveBoardChange = (e) => {
      activeBoard.value = e
    }
    const showUIFull = ref(true)
    const showClear = ref(false)


    onUpdated(() => {
      colorLog('on updated main layout', 'orange', 'yellow')
    })

    const error = ref(null)

    onErrorCaptured(e => {
      error.value = e
      console.log(e)
      return true
    })

    const router = useRouter()
    const store = useStore()

    //#region new / contact
      const tableStore = store.modules[TABLE_STORE_LOCAL_SYMBOL]
      const contactStore: ContactStore = store.modules[CONTACT_STORE_SYMBOL]
      const cont = {} as Contact
      const contARr = []
      contARr.push(cont)
      const allContacts = ref<Contact[]>(contARr)
      const loading = ref(true)
      allContacts.value = await contactStore.loadRecords('contact')
      loading.value = false

    //#region task
      const taskStore: TaskStore = store.modules[TASK_STORE_SYMBOL]
      const allTasks = ref<Task[]>([])
      const tasksLoading = ref(true)
      allTasks.value = await taskStore.loadRecords('task')
      tasksLoading.value = false

    //#endregion

    //#region message
      const messageStore: MessageStore = store.modules[MESSAGE_STORE_SYMBOL]
      const allMessages = ref<Message[]>([])
      const messagesLoading = ref(true)
      allMessages.value = await messageStore.loadRecords('message')
      messagesLoading.value = false
    //#endregion

    //#region modal
      const deleteItemDestination: Destination = '#delete-item-modal'
      const itemDeleteModal = useModal(deleteItemDestination)
      const editItemDestination: Destination = '#edit-item-modal'
      const itemEditModal = useModal(editItemDestination)
    //#endregion

    //#region update values
      const onUpdateContacts = async () => {
        console.log('update contacts')
        await nextTick()
        // tables.filter(t => t.value.itemType == contactItemtype.value)[0].value.items = await contactStore.updateRecords('contact')
        tables[0].value.items = await contactStore.updateRecords('contact')
      }
      const onUpdateTasks = async () => {
        console.log('update tasks')
        await nextTick()
        // tables.filter(t => t.value.itemType == taskItemtype.value)[0].value.items = await taskStore.updateRecords('task')
        tables[1].value.items = await taskStore.updateRecords('task')
      }
      const onUpdateMessages = async () => {
        console.log('update messages')
        await nextTick()
        // tables.filter(t => t.value.itemType == messageItemtype.value)[0].value.items = await messageStore.updateRecords('message')
        tables[2].value.items = await messageStore.updateRecords('message')
      }
      const onUpdateValues = (e) => {
        colorLog('on update values - main layout', 'magenta', 'white')
        console.log(e)
        switch(e) {
          case 'task':
            onUpdateTasks();
            break;
          case 'contact':
            onUpdateContacts();
            break;
        }
      }
    //#endregion

    //#region table
      const testItems = ref([])
      const testItemType = ref('Test_Item')
      const contactItemtype = ref('contact')
      const taskItemtype = ref('task')
      const messageItemtype = ref('message')

      testItems.value = tableStore.getRecordsFromStore()
      // console.log(items.value)
      // need to figure out rest of logic for empty array of items
      const testColumnNames = computed(() => testItems.value.length > 0 ? Object.keys(testItems.value[0]) : [])    

      // console.log(allContacts.value)
      // console.log(allTasks.value)
      // console.log(allMessages.value)
      const tables = toRefs(reactive([
        // {
        //   columnNames: testColumnNames,
        //   items: testItems.value,
        //   itemType: testItemType.value,
        //   idSymbol: ITEMS_ID_SYMBOL
        // },
          {
            columnNames: Object.keys(allContacts.value[0]),
            items: allContacts.value,
            itemType: contactItemtype.value,
            idSymbol: CONTACT_ID_SYMBOL,
            store: contactStore,
            // updateCallback: onUpdateContacts
          },
          {
            columnNames: Object.keys(allTasks.value[0]),
            items: allTasks.value,
            itemType: taskItemtype.value,
            idSymbol: TASK_ID_SYMBOL,
            store: taskStore,
            // updateCallback: onUpdateTasks
          },
          {
            columnNames: Object.keys(allMessages.value[0]),
            items: allMessages.value,
            itemType: messageItemtype.value,
            idSymbol: MESSAGE_ID_SYMBOL,
            store: messageStore,
          },
        ]))

      const deleteConfirm = ref(false)

      const confirmDelete = () => {
        colorLog('confirm delete from main layout', 'magenta', 'yellow')
        deleteConfirm.value = true; 
        // deleteConfirm.value = false;
      }
    
      //#region tables dynamic - experimental
        // const tableTypes = reactive([
        //   {itemType: 'message', idSymbol: '_id', items: allMessages.value},
        //   {itemType: 'task', idSymbol: '_id', items: allTasks.value},
        //   {itemType: 'contact', idSymbol: '_id', items: allContacts.value},
        // ])

        // const tableItems = (dataMap, controlMap) => {
        //   colorLog("compute table items", "blue", "pink")
        //   console.log(dataMap.message.value)
        //   console.log(controlMap.message.value)
        //   return [
        //   ...tableTypes.map((type, i) => {
        //     console.log()
        //     const { columns, controlNames, columnNames } = new TableConfig({
        //       data: dataMap[type.itemType].value, controls: controlMap[type.itemType].value
        //     })
        //     return {
        //       itemType: type.itemType,
        //       idSymbol: type.idSymbol,
        //       items: type.items,
        //       columns: columns,
        //       columnNames: columnNames,
        //       controlNames: controlNames
        //     }
        //   })
        // ]}
        // const configRef = ref()
      //#endregion
    //#endregion

    return {
      // main
      deleteConfirm,
      confirmDelete,
      tables,
      testItems,
      testItemType,
      testColumnNames,
      ITEMS_ID_SYMBOL,
      // edit
      itemEditModal,
      editItemDestination,
      // contact
      onUpdateContacts,
      // task
      onUpdateTasks,
      // message
      onUpdateMessages,
      // values
      onUpdateValues,
      loading,
      error,
      showUIFull,
      itemDeleteModal,
      allContacts,
      allTasks,
      allMessages,
      activeBoard,
      showClear,
      handleActiveBoardChange,
    }

  }
})
</script>

<style lang="scss">
</style>
