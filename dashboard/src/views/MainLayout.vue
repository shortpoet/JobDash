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
      <div class="column is-one-half">
        <TableLayout
          :table-items="configRef"
          :editModal="itemEditModal"
          :deleteModal="itemDeleteModal"
          :messages="allMessages"
          @update-messages="onUpdateMessages"
          @handle-delete="handleDelete"
          @update-chosen-properties="updateChosenProperties"
          @handle-toggle-delete="handleToggleDelete"
          @handle-toggle-edit="handleToggleEdit"
          @handle-input-edit="handleInputEdit"
          @handle-confirm-edit="handleConfirmEdit"
          @confirm-delete="confirmDelete"
          @update-values="onUpdateValues"
          :item-under-edit="itemUnderEdit"
          @handle-column-change="handleColumnChange"
          @handle-control-change="handleControlChange"          
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
import TableLayout from './TableLayout.vue'
import BoardLayout from './BoardLayout.vue'
import BaseMinimize from '../components/common/BaseMinimize.vue'
import { onErrorCaptured } from 'vue'

import { useRouter } from 'vue-router'
import { useStore } from '../store'

import { useModal } from '../composables/useModal'
import useContact from '../composables/useContact'
import useTask from '../composables/useTask'

import { Destination } from '../interfaces/common/modal.interface'
import { Contact } from '../interfaces/contact/contact.interface'
import { Task } from '../interfaces/task/task.interface'
import { BoardStore } from '../store/board.store'
import { IBoardColumn } from '../interfaces/board/board.column.interface'
import useBoard from '../composables/useBoard'
import useMessage from '../composables/useMessage'
import { useDelete } from '../composables/table/useDelete'
import { useEdit } from '../composables/table/useEdit'
import { useInitEdit } from '../composables/table/useInitEdit'
import { colorLog } from '../utils'

import { ITableConfig, BaseTableConfig, ID, DELETE, EDIT, LOCKED, MESSAGE, TableData, TableConfig, ControlName, ITableData, TableControl  } from './../interfaces/table/table._interface'

import { taskProps, taskData, contactProps, contactData, messageProps, messageData } from './columns'
import { taskControls, contactControls, messageControls } from './controls'

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
    const activeBoard = ref('1')
    const handleActiveBoardChange = (e) => {
      activeBoard.value = e
    }
    const showUIFull = ref(true)
    const showClear = ref(false)


    //#region contactUse
      const contactStore = store.modules['contactStore']

      const allContacts = ref<Contact[]>([])

      const contactUse = await useContact(contactStore, allContacts)

      const onUpdateContacts = contactUse.onUpdateContacts
    //#endregion
    
    //#region taskUse
      const taskStore = store.modules['taskStore']

      const allTasks = ref<Task[]>([])

      const taskUse = await useTask(taskStore, allTasks)

      console.log(allTasks.value)

      const onUpdateTasks = taskUse.onUpdateTasks

    //#endregion

    //#region messageUse
      const messageStore = store.modules['messageStore']

      const allMessages= ref<Task[]>([])

      const messageUse = await useMessage(messageStore, allMessages)

      const onUpdateMessages= messageUse.onUpdateMessages
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

    
    const propArrays = [taskProps, contactProps, messageProps]

    // const dataArrays: ITableData[][] = propArrays.map(arr => ([
    //   ...arr.map((prop, i) => <ITableData> ({
    //     propertyName: prop,
    //     editable: false,
    //     displayOrder: i
    //   }))
    // ]))

    const dataArrays = [taskData, contactData, messageData]

    const taskDataColsRef = ref(taskData)
    const contactDataColsRef = ref(contactData)
    const messageDataColsRef = ref(messageData)

    const taskControlsRef = ref(taskControls)
    const contactControlsRef = ref(contactControls)
    const messageControlsRef = ref(messageControls)

    const controlArrays = toRefs([taskControls, contactControls, messageControls])

    const dataMap = toRefs(reactive({
      task: taskDataColsRef.value,
      contact: contactDataColsRef.value,
      message: messageDataColsRef.value
    }))
    const controlMap = toRefs(reactive({
      task: taskControlsRef.value,
      contact: contactControlsRef.value,
      message: messageControlsRef.value
    }))


    const handleColumnChange = (e) => {
      colorLog("handle col change", "white", "green")
      console.log(e)
      const key = e.itemType
      dataMap[key] = ref(e.columns)
      console.log(dataMap)
    }
    const handleControlChange = (e) => {
      colorLog("handle control change", "white", "green")
      console.log(e)
      console.log(controlMap)
      const key = e.itemType
      controlArrays[2].value = e.controls
      messageControlsRef.value = e.controls
      // need to remap data to config schema in controls.ts
      // controlMap[key] = ref(e.controls)
    }

    // console.log(dataArrays)

    const data: ITableData[] = []

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
    watch(
      () => messageControlsRef.value.length,
      (value: number, previous:number) => {
        console.log(`Watch controls.value.length function called with args:", \nvalue: ${value}, \nprevious: ${previous}`)
        configRef.value = tableItems(dataMap, controlMap)
      },
      {immediate: true}
    )

    configRef.value = tableItems(dataMap, controlMap)
    Object.entries(dataMap).forEach(entry => {
      console.log(entry[0])
      console.log(entry[1].value)
      watch(
        () => entry[1].value.length,
        (value: number, previous:number) => {
          console.log(`Watch controls.value.length function called with args:", \nvalue: ${value}, \nprevious: ${previous}`)
          configRef.value = tableItems(dataMap, controlMap)
        },
        {immediate: true}
      )
    })

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
          onUpdateTasks()
        } else {
          await taskStore.toggleDeletable(e.item, false)
          onUpdateTasks()
        }
      }
    }
    const handleDelete = (e) => {
      // console.log(e)
      switch(e.itemType) {
        case 'task':
          taskDelete.handleConfirmDelete(e.item, itemDeleteModal, taskIdSymbol, onUpdateTasks)
      }
    }
    const confirmDelete = (e) => {
      switch(e.itemType) {
        case 'task':
          taskDelete.deleteItem(itemDeleteModal, taskIdSymbol, onUpdateTasks)
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
              
            editItem(e.item, taskIdSymbol, onUpdateTasks, taskItemTouched)
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
      // tableItems,
      configRef,
      handleColumnChange,
      handleControlChange,
      error,
      showUIFull,
      contactCardModal,
      // handleEditModal,
      itemEditModal,
      itemDeleteModal,
      allContacts,
      allTasks,
      allMessages,
      onUpdateContacts,
      onUpdateTasks,
      onUpdateMessages,
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
