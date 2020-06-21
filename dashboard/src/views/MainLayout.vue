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
          :contacts="allContacts"
          @update-contacts="onUpdateContacts"
          :tasks="allTasks"
          :deleteModal="itemDeleteModal"
          @update-tasks="onUpdateTasks"
          :messages="allMessages"
          @update-messages="onUpdateMessages"
          @handle-delete="handleDelete"
          @handle-input-edit="handleInputEdit"
          @handle-confirm-edit="handleConfirmEdit"
          @handle-toggle-edit="handleToggleEdit"
          @confirm-delete="confirmDelete"
          @update-values="onUpdateValues"
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
import { defineComponent, computed, ref, watch, nextTick, onUpdated } from 'vue'

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
        const isCard = isContact || isTask
        return {
          isCard: isCard,
          type: isTask ? 'task' : 'contact'
        }
      })

      const deleteItemDestination: Destination = '#delete-item-modal'
      const itemDeleteModal = useModal(deleteItemDestination)


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
    const handleDelete = (e) => {
      console.log(e)
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
    // const onUpdateValues = (e) => {
    //   console.log(e)
    //   switch(e.itemType) {
    //     case 'task':
    //       onUpdateTasks()
    //   }
    // }

  //#endregion

  let taskItemTouched = ref()
  const taskEdit = useEdit(taskStore, ctx)


  //#region edit

    const handleToggleEdit = (e) => {
      console.log(e)
      switch(e.itemType) {
        case 'task':
          colorLog('handle toggle edit at main layout', 'green', 'silver')
          // const toggleEditable = taskEdit.toggleEditable
          // toggleEditable(taskItemTouched)

      }
    }
    const handleInputEdit = (e) => {
      console.log(e)
      switch(e.itemType) {
        case 'task':
          colorLog('edited item at main layout', 'purple', 'green')
          const toggleEditable = taskEdit.toggleEditable
          taskItemTouched.value = e.valueChanged
          toggleEditable(taskItemTouched, e.value, e.propertyName)
      }
    }
    const handleConfirmEdit = (e) => {
      console.log(e)
      switch(e.itemType) {
        case 'task':
          colorLog('confirm edit item at main layout', 'yellow', 'blue')
          const editItem = taskEdit.editItem
          editItem(e.item, taskIdSymbol, onUpdateTasks, taskItemTouched)
      }
    }
    
    // const confirmDelete = (e) => {
    //   switch(e.itemType) {
    //     case 'task':
    //       taskDelete.deleteItem(itemDeleteModal, taskIdSymbol, onUpdateTasks)
    //   }
    // }

  //#endregion

    return {
      error,
      showUIFull,
      contactCardModal,
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
      handleDelete,
      handleToggleEdit,
      handleInputEdit,
      handleConfirmEdit,
      confirmDelete
    }

  }
})
</script>

<style lang="scss">
</style>
