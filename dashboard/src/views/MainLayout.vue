<template>

  <div class="main-layout" v-if="targetsLoadedRef">
    <BaseMinimize
      :class-prop="'columns'"
      :component-name="'Create and Tables'"
    >
      <div class="column is-two-fifths">
        <CreateLayout
          @update-contacts="onUpdateContacts"    
          @update-tasks="onUpdateTasks"
        />
        <BoardControls @active-board="handleActiveBoardChange"/>
        <!-- <TabsLayout @tab-change="tabChange"/> -->
      </div>
      <div class="column is-one-half">
        <TableLayout
          :contacts="allContacts"
          @update-contacts="onUpdateContacts"
          :tasks="allTasks"
          @update-tasks="onUpdateTasks"
        />
      </div>
      </BaseMinimize>
    <TaskBoardLayout
      :tasks="allTasks"
      :active-board="activeBoard"
    />
  </div>
  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, nextTick } from 'vue'

import CreateLayout from './CreateLayout.vue'
import TableLayout from './TableLayout.vue'
import TaskBoardLayout from './TaskBoardLayout.vue'
import BaseIcon from '../components/common/BaseIcon.vue'
import BaseMinimize from '../components/common/BaseMinimize.vue'
import BaseInput from '../components/common/BaseInput.vue'
import BoardControls from '../components/board/BoardControls.vue'

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

export default defineComponent({
  name: 'MainLayout',

  components: {
    BaseIcon,
    BaseMinimize,
    BaseInput,
    CreateLayout,
    TableLayout,
    BoardControls,
    TaskBoardLayout
  },
  async setup(props, ctx) {

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

    //#region cardModal
      const contactCardDestination: Destination = '#contact-card-modal'
      const taskCardDestination: Destination = '#task-card-modal'
      const messageDestination: Destination = '#message-modal'

      const contactCardModal = useModal(contactCardDestination)
      const taskCardModal = useModal(taskCardDestination)
      const messageModal = useModal(messageDestination)

      const targetsLoadedRef = ref(false)
      targetsLoadedRef.value = !!document.querySelector(taskCardDestination) 
      
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

    return {
      showUIFull,
      contactCardModal,
      allContacts,
      allTasks,
      onUpdateContacts,
      onUpdateTasks,
      targetsLoadedRef,
      activeBoard,
      showClear,
      clearStorage: () => window.localStorage.clear(),
      handleActiveBoardChange
    }

  }
})
</script>

<style lang="scss">
</style>
