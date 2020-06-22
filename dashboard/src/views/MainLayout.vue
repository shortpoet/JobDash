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
          :table-items="tableItems"
          :contacts="allContacts"
          @update-contacts="onUpdateContacts"
          :tasks="allTasks"
          :editModal="itemEditModal"
          :deleteModal="itemDeleteModal"
          @update-tasks="onUpdateTasks"
          :messages="allMessages"
          @update-messages="onUpdateMessages"
          @handle-delete="handleDelete"
          @handle-toggle-delete="handleToggleDelete"
          @handle-toggle-edit="handleToggleEdit"
          @handle-input-edit="handleInputEdit"
          @handle-confirm-edit="handleConfirmEdit"
          @confirm-delete="confirmDelete"
          @update-values="onUpdateValues"
          :item-under-edit="itemUnderEdit"
        />
      </div>
    </BaseMinimize>

    <BoardLayout
      :items="allTasks"
      :active-board="activeBoard"
    />
  </div>
  
  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, nextTick, onUpdated, reactive, toRefs } from 'vue'

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

    const tableItems = reactive([
      {itemType: 'task', idSymbol: '_id', items: allTasks.value},
      {itemType: 'contact', idSymbol: '_id', items: allContacts.value},
      {itemType: 'message', idSymbol: '_id', items: allMessages.value}
    ])

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
      tableItems,
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
