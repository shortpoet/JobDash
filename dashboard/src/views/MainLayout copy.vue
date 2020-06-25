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
      <div class="column is-two-fifths">
        <CreateLayout
          @update-contacts="onUpdateContacts"    
          @update-tasks="onUpdateTasks"
        />
        <!-- <TabsLayout @tab-change="tabChange"/> -->
      </div>
      <div class="column is-three-fifths">
        <TableLayout
          v-for="(table, i) in tables"
          :destination="editItemDestination"
          :column-names="table.columnNames"
          :items="table.items"
          :item-type="table.itemType"
          :id-symbol="table.idSymbol"
        />
      </div>
    </BaseMinimize>

    <!-- <BoardLayout
      :items="allTasks"
      :active-board="activeBoard"
    /> -->
  </div>
  
  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, nextTick, onUpdated, reactive, toRefs, Ref, isRef } from 'vue'

import CreateLayout from './CreateLayout.vue'
import BoardLayout from './BoardLayout.vue'
import BaseMinimize from '../components/common/BaseMinimize.vue'
import { onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { useStore, ITEMS_ID_SYMBOL, TABLE_STORE_LOCAL_SYMBOL, CONTACT_STORE_SYMBOL, CONTACT_ID_SYMBOL, TASK_STORE_SYMBOL, MESSAGE_STORE_SYMBOL } from '../store'

import { useModal } from '../composables/useModal'

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
    BoardLayout
  },
  emits: ['update-values'],
  async setup(props, ctx) {

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

    //#region new
      const tableStore = store.modules[TABLE_STORE_LOCAL_SYMBOL]
      const contactStore: ContactStore = store.modules[CONTACT_STORE_SYMBOL]
      const cont = {} as Contact
      const contARr = []
      contARr.push(cont)
      const allContacts = ref<Contact[]>(contARr)
      const loading = ref(true)
      allContacts.value = await contactStore.loadRecords('contact')
      loading.value = false

    //#region taskUse
      const taskStore: TaskStore = store.modules[TASK_STORE_SYMBOL]
      const allTasks = ref<Task[]>([])
      const tasksLoading = ref(true)
      allTasks.value = await taskStore.loadRecords('task')
      tasksLoading.value = false

    //#endregion

    //#region messageUse
      const messageStore: MessageStore = store.modules[MESSAGE_STORE_SYMBOL]
      const allMessages = ref<Message[]>([])
      const messagesLoading = ref(true)
      allMessages.value = await messageStore.loadRecords('message')
      messagesLoading.value = false
    //#endregion

      const onUpdateContacts = async () => {
        console.log('update')
        console.log(allContacts.value.length)
        await nextTick()
        tables[1].value.items = await contactStore.updateRecords('contact')
      }
      console.log(allContacts.value)


    //#region table
      const testItems = ref([])
      const testItemType = ref('Test_Item')
      const contactItemtype = ref('contact')

      testItems.value = tableStore.getRecordsFromStore()
      // console.log(items.value)
      // need to figure out rest of logic for empty array of items
      const testColumnNames = computed(() => testItems.value.length > 0 ? Object.keys(testItems.value[0]) : [])    

      const tables = toRefs(reactive([
        {
          columnNames: testColumnNames,
          items: testItems.value,
          itemType: testItemType.value,
          idSymbol: ITEMS_ID_SYMBOL
        },
        {
          columnNames: Object.keys(allContacts.value[0]),
          items: allContacts.value,
          itemType: contactItemtype.value,
          idSymbol: CONTACT_ID_SYMBOL
        },
      ]))
      // console.log('use')
      // // console.log(contactUse)
      // console.log(result.value)
      // console.log(result)
      // if (!loading) allContacts.value = result.value
      // watch(
      //   () => loading.value,
      //   (value, previous) => {
      //     console.log('watch loading');
      //     console.log(loading.value)
      //     console.log(value, previous);
      //     if (value == false) {
      //       console.log('loading false');
      //       console.log(result)
      //       console.log(result.value)
      //       allContacts.value = result.value
      //       tables[1].value.items = result.value


      //     } 
      //   },
      //   {immediate: true}
      // )

      // const allContacts = ref([])

      // let onUpdateContacts 

  //#endregion

    const activeBoard = ref('1')
    const handleActiveBoardChange = (e) => {
      activeBoard.value = e
    }
    const showUIFull = ref(true)
    const showClear = ref(false)


    //#region contactUse
      // const contactStore = store.modules['contactStore']

      // const allContacts = ref<Contact[]>([])


      // const onUpdateContacts = contactUse.onUpdateContacts
    //#endregion
    
    //#region modal
      const deleteItemDestination: Destination = '#delete-item-modal'
      const itemDeleteModal = useModal(deleteItemDestination)
      const editItemDestination: Destination = '#edit-item-modal'
      const itemEditModal = useModal(editItemDestination)
    //#endregion

    // colorLog('items', 'red', 'yellow')
    // console.log(Object.keys(allTasks.value[0]))
    // console.log(Object.keys(allContacts.value[0]))
    // console.log(Object.keys(allMessages.value[0]))
    const updateChosenProperties = (e) => {
      colorLog('update chosen props', 'green', 'orange')
      console.log(e)
    }

    
    // const propArrays = [taskProps, contactProps, messageProps]

    // const dataArrays: ITableData[][] = propArrays.map(arr => ([
    //   ...arr.map((prop, i) => <ITableData> ({
    //     propertyName: prop,
    //     editable: false,
    //     displayOrder: i
    //   }))
    // ]))

    // const dataArrays = [taskData, contactData, messageData]

    // const taskDataColsRef = ref(taskData)
    // const contactDataColsRef = ref(contactData)
    // const messageDataColsRef = ref(messageData)

    // const taskControlsRef = ref(taskControls)
    // const contactControlsRef = ref(contactControls)
    // const messageControlsRef = ref(messageControls)

    // const controlArrays = toRefs([taskControls, contactControls, messageControls])

    // const dataMap = toRefs(reactive({
    //   task: taskDataColsRef.value,
    //   contact: contactDataColsRef.value,
    //   message: messageDataColsRef.value
    // }))
    // const controlMap = toRefs(reactive({
    //   task: taskControlsRef.value,
    //   contact: contactControlsRef.value,
    //   message: messageControlsRef.value
    // }))


    // const handleColumnChange = (e) => {
    //   colorLog("handle col change", "white", "green")
    //   console.log(e)
    //   const key = e.itemType
    //   dataMap[key] = ref(e.columns)
    //   console.log(dataMap)
    // }
    // const handleControlChange = (e) => {
    //   colorLog("handle control change", "white", "green")
    //   console.log(e)
    //   console.log(controlMap)
    //   const key = e.itemType
    //   controlArrays[2].value = e.controls
    //   messageControlsRef.value = e.controls
    //   // need to remap data to config schema in controls.ts
    //   // controlMap[key] = ref(e.controls)
    // }

    // console.log(dataArrays)


    // const configSettings = (i) =>
    //   new TableConfigSettings({
    //     data: dataArrays[i].map(datum => new TableData(datum.propertyName, datum.editable, datum.displayOrder)),
    //     controls: controlArrays[i].map(datum => new TableControl(datum))
    //   })
    

    // const { columns, controlNames, columnNames } = new TableConfig(configSettings(0))

    const tableTypes = reactive([
      {itemType: 'message', idSymbol: '_id', items: allMessages.value},
      {itemType: 'task', idSymbol: '_id', items: allTasks.value},
      {itemType: 'contact', idSymbol: '_id', items: allContacts.value},
    ])
    // const tableItems = reactive([
    //   ...tableTypes.map((type, i) => {
    //     const { columns, controlNames, columnNames } = new TableConfig({
    //       data: dataMap[type.itemType], controls: controlMap[type.itemType]
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
    // ])
    const tableItems = (dataMap, controlMap) => {
      colorLog("compute table items", "blue", "pink")
      console.log(dataMap.message.value)
      console.log(controlMap.message.value)
      return [
      ...tableTypes.map((type, i) => {
        console.log()
        const { columns, controlNames, columnNames } = new TableConfig({
          data: dataMap[type.itemType].value, controls: controlMap[type.itemType].value
        })
        return {
          itemType: type.itemType,
          idSymbol: type.idSymbol,
          items: type.items,
          columns: columns,
          columnNames: columnNames,
          controlNames: controlNames
        }
      })
    ]}
    const configRef = ref()
    // colorLog("#### UNREF ####", "orange", "purple")
    // const unRef = (obj) => {
    //   console.log(obj)
    //   Object.entries(obj).forEach(entry => {
    //     if (isRef(entry[1])) {
    //       entry[1] = entry[1].value
    //     }
    //   })
    //   console.log(obj)
    //   return obj
    // }
    // const unwrap = v => (isRef(v) ? v.value : v)
    // watch(
    //   () => messageControlsRef.value.length,
    //   (value: number, previous:number) => {
    //     console.log(`Watch controls.value.length function called with args:", \nvalue: ${value}, \nprevious: ${previous}`)
    //     configRef.value = tableItems(dataMap, controlMap)
    //   },
    //   {immediate: true}
    // )

    // configRef.value = tableItems(dataMap, controlMap)
    // Object.entries(dataMap).forEach(entry => {
    //   console.log(entry[0])
    //   console.log(entry[1].value)
    //   watch(
    //     () => entry[1].value.length,
    //     (value: number, previous:number) => {
    //       console.log(`Watch controls.value.length function called with args:", \nvalue: ${value}, \nprevious: ${previous}`)
    //       configRef.value = tableItems(dataMap, controlMap)
    //     },
    //     {immediate: true}
    //   )
    // })

    //#region cardModal
      const contactCardDestination: Destination = '#contact-card-modal'
      const taskCardDestination: Destination = '#task-card-modal'
      const messageDestination: Destination = '#message-modal'

      const contactCardModal = useModal(contactCardDestination)
      const taskCardModal = useModal(taskCardDestination)
      const messageModal = useModal(messageDestination)

      // const targetsLoadedRef = ref(false)
      // targetsLoadedRef.value = !!document.querySelector(taskCardDestination) 
      
      // const targetsLoaded = computed(() => {
      //   console.log('target loaded')
      //   const out = document.querySelector(taskCardDestination) != null
      //   console.log(out)
      //   return out
      // })

      const routeIsCard = computed(() => {
        const isContact = router.currentRoute.value.name == contactCardDestination
        const isTask = router.currentRoute.value.name == taskCardDestination
        const isEditItem = router.currentRoute.value.name == editItemDestination
        const isCard = isContact || isTask || isEditItem
        return {
          isCard: isCard,
          type: isTask ? 'task' : 'contact'
        }
      })

      const handleModal = () => {
        switch(router.currentRoute.value.name) {
          case contactCardDestination:
            contactCardModal.showModal()
            break
          case taskCardDestination:
            taskCardModal.showModal()
            break
          case messageDestination:
            messageModal.showModal()
            break
          // no item in params
          // could add query but hacky
          // or just skip it
          // case editItemDestination:
          //   itemEditModal.showModal()
          //   break
          break
        }
        // if (routeIsCard.value.isCard) {
        //   // console.log('route is card')
        //   if (routeIsCard.value.type == 'contact') {
        //     if(document.querySelector(contactCardDestination)) {
        //       contactCardModal.showModal()
        //     }
        //   }
        //   if (routeIsCard.value.type == 'task') {
        //     if(document.querySelector(taskCardDestination)) {
        //       taskCardModal.showModal()
        //     }
        //   }
        //   if (document.querySelector(taskCardDestination)) {
        //     // console.log('target loaded from handle modal')
        //   }
        // }
      }

      handleModal()
    //#endregion

  //#region delete
    const taskIdSymbol = '_id'
    const taskDelete = useDelete(taskStore, ctx)

    const handleToggleDelete = async (e) => {
      colorLog('handle toggle delete at main layout', 'yellow', 'green')
      console.log(e)
      switch(e.itemType) {
        case 'task':
        console.log(e.item.locked)
        console.log(e.item)
        if (e.item.locked == false) {
          await taskStore.toggleDeletable(e.item, true)
          // refactor with new store
          // onUpdateTasks()
        } else {
          await taskStore.toggleDeletable(e.item, false)
          // refactor with new store
          // onUpdateTasks()
        }
      }
    }
    const handleDelete = (e) => {
      // console.log(e)
      switch(e.itemType) {
        case 'task':
          // refactor with new store
          // taskDelete.handleConfirmDelete(e.item, itemDeleteModal, taskIdSymbol, onUpdateTasks)
      }
    }
    const confirmDelete = (e) => {
      switch(e.itemType) {
        case 'task':
          // refactor with new store
          // taskDelete.deleteItem(itemDeleteModal, taskIdSymbol, onUpdateTasks)
      }
    }
  //#endregion

  //#region edit
    //#region table edit
      let taskItemTouched = ref()
      const taskEdit = useEdit(taskStore)
      let itemUnderEdit = ref()

      const handleToggleEdit = (e) => {
        // colorLog('toggle edited item at main layout', 'purple', 'green')
        // console.log(e)
        if (!itemUnderEdit.value) {
          // if it is false but being emitted it wants this component to set it to true
          itemUnderEdit.value = e.item          
        } else {
          itemUnderEdit.value = null
          handleConfirmEdit(e)
        }
      }

      const handleInputEdit = (e) => {
        // console.log(e)
        switch(e.itemType) {
          case 'task':
            // colorLog('edited item at main layout', 'purple', 'green')
            const toggleEditable = taskEdit.toggleEditable
            taskItemTouched.value = e.valueChanged
            toggleEditable(taskItemTouched, e.value, e.propertyName)
        }
      }
      const handleConfirmEdit = (e) => {
        console.log(e)
        switch(e.itemType) {
          case 'task':
            // colorLog('confirm edit item at main layout', 'yellow', 'blue')
            const editItem = taskEdit.editItem
            e.modal
              ? taskItemTouched.value = true
              : taskItemTouched.value = taskItemTouched.value
            // refactor with new store        
            // editItem(e.item, taskIdSymbol, onUpdateTasks, taskItemTouched)
        }
      }
    //#endregion

    // //#region modal edit
    //   const handleEditModal = (e) => {
    //     switch(e.itemType) {
    //       case 'task':
    //         colorLog('handle edit modal at main layout', 'blue', 'green')
    //         itemEditModal.showModal()
    //         const idSymbol = '_id'
    //         const itemType = 'task'
    //         console.log(e.item[idSymbol])
    //         router.push({
    //           name: '#edit-item-modal',
    //           path: `/${itemType}/${e.item[idSymbol]}`,
    //           params: { id: e.item[idSymbol] } 
    //         })
    //     }
    //   }
    // //#endregion

  //#endregion

    return {
      // main
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
      loading,

      // tableItems,
      // configRef,
      // handleColumnChange,
      // handleControlChange,
      error,
      showUIFull,
      contactCardModal,
      // handleEditModal,
      // itemEditModal,
      itemDeleteModal,
      allContacts,
      allTasks,
      allMessages,
      // onUpdateContacts,
      // refactor with new store
      // onUpdateTasks,
      // onUpdateMessages,
      // targetsLoadedRef,
      activeBoard,
      showClear,
      handleActiveBoardChange,
      itemUnderEdit,
      handleToggleEdit,
      handleInputEdit,
      handleConfirmEdit,
      handleDelete,
      handleToggleDelete,
      confirmDelete
    }

  }
})
</script>

<style lang="scss">
</style>
