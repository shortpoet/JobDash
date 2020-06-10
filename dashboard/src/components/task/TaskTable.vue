<template>
  <table class="table is-hoverable">
    <thead>
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Category</th>
        <th>Description</th>
        <th>Contact Id</th>
        <th>Delete</th>
        <th>Edit</th>
        <th>Locked</th>
      </tr>
    </thead>
    <tr
      v-for="task in tasks"
      :key="task._id" 
      class="task-row"   
    >

      <td class="id-cell" @click="openCard">
        <BaseIcon name="external-link" color="purple">{{ task._id }}</BaseIcon>
      </td>

      <td v-if="task.editable" contenteditable>
        <BaseInput type="text" name="Name" v-model="nameEdit" />
          {{ nameEdit }}
      </td>
      <td v-else>{{ task.name }}</td>

      <td v-if="task.editable" contenteditable>
        <BaseInput type="text" name="Category" v-model="categoryEdit" />
          {{ categoryEdit }}
      </td>
      <td v-else>{{ task.category }}</td>

      <td v-if="task.editable" contenteditable>
        <BaseInput type="text" name="Category" v-model="descriptionEdit" />
          {{ descriptionEdit }}
      </td>
      <td v-else>{{ task.description }}</td>

      <td>{{ task.contact._id }}</td>

      <td class="icon-cell" @click="handleConfirmDelete(task)">
        <BaseIcon color="red" name="trash-2"></BaseIcon>
      </td>

      <td class="icon-cell" @click="toggleEditable(task)">
        <BaseIcon color="blue" name="edit"></BaseIcon>        
      </td>

      <td class="icon-cell" v-if="task.locked" @click="toggleDeletable(task)">
        <BaseIcon color="gold" name="lock"></BaseIcon>
      </td>
      <td class="icon-cell" v-else @click="toggleDeletable(task)">
        <BaseIcon color="silver" name="unlock"></BaseIcon>
      </td>

    </tr>
  </table>

  <teleport to="#delete-task-modal" v-if="modal.visible">
    <ModalWarning @delete-item="deleteTask" :destination="'#delete-task-modal'"/>
  </teleport>

  <teleport to="#task-card-modal" v-if="taskCardModal.visible">
    <TaskCard @save-item="editTask" :destination="'#task-card-modal'"/>
  </teleport>

  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import moment from 'moment'

import BaseInput from './../../components/common/BaseInput.vue'
import BaseIcon from './../../components/common/BaseIcon.vue'
import ModalWarning from './../../components/common/ModalWarning.vue'

import TaskCard from './TaskCard.vue'

import { Task } from '../../interfaces/task.interface'
import { Field } from '../../interfaces/field.interface'
import { Destination } from '../../interfaces/modal.interface'

import { useModal } from '../../composables/useModal'
import useTask from '../../composables/useTask'
import { useStore } from '../../store'
import { useRouter } from 'vue-router'
import { TaskStore } from '../../store/task.store'

export default defineComponent({
  name: 'TaskTable',

  props: {
    tasks: {
      type: Array,
      required: true
    }
  },

  components: {
    BaseInput,
    ModalWarning,
    BaseIcon,
    TaskCard
  },

  emits: ['update-tasks'],

  async setup(props, ctx){

    const store = useStore()

    //#region taskCardModal

      const taskCardDestination: Destination = '#task-card-modal'

      const taskCardModal = useModal(taskCardDestination)

    //#endregion

    //#region openCard
      const router = useRouter()
      const openCard = (_id) => {
        console.log(_id)
        console.log(ctx)
        taskCardModal.showModal()
        router.push({ name: '#task-card-modal', params: { id: _id } })
      }
      const cardIsOpen = computed(() => {
        console.log(router.currentRoute.value.name)
        console.log(taskCardDestination)
        return router.currentRoute.value.name === taskCardDestination
      })
    //#endregion

    //#region taskUse
      const taskStore: TaskStore = store.modules['taskStore']
    //#endregion

    //#region delete
      const confirmDelete = ref(false)
      const deleteCandidate = ref<Task>(null)
      const destination: Destination = '#delete-task-modal'
      const modal = useModal(destination)

      // const modal = useModal()
      // this didn't properly return a reactive ref
      // const modalMap = useModalMap()
      // const destination = '#delete-task-modal'
      // modalMap.addModal(destination)
      // const modal = modalMap.modalMap[destination]


      const handleConfirmDelete = (task: Task) => {
        if (task.locked) {
          deleteCandidate.value = task
          modal.showModal()
        } else {
          deleteCandidate.value = task
          deleteTask()
        }
      }
      
      const deleteTask = async (e?) => {
        if (e) {
          if (e == destination) {
            modal.hideModal()
            const deletedId = await taskStore.deleteRecord(deleteCandidate.value)
            console.log('delete task')
            deleteCandidate.value._id == deletedId ? deleteCandidate.value = null : ''
            // null check
            // console.log(deleteCandidate.value)
            ctx.emit('update-tasks')
          }          
        } else {
          const deletedId = await taskStore.deleteRecord(deleteCandidate.value)
          console.log('delete task')
          deleteCandidate.value._id == deletedId ? deleteCandidate.value = null : ''
          // null check
          // console.log(deleteCandidate.value)
          ctx.emit('update-tasks')
        }
      }
      
      const toggleDeletable = async (task: Task) => {
        // console.log('task table')
        // console.log(task.locked)
        if (task.locked == false) {
          await taskStore.toggleDeletable(task, true)
          ctx.emit('update-tasks')
          // console.log(task.locked)
        } else {
          await taskStore.toggleDeletable(task, false)
          ctx.emit('update-tasks')
          // console.log(task.locked)
        }
      }
    //#endregion

    //#region edit
      const nameEdit = ref() 
      const categoryEdit = ref() 
      const descriptionEdit = ref() 
      const taskTouched = ref(false)

      const toggleEditable = async (oldTask: Task) => {
        if (oldTask.editable == false) {
          taskStore.toggleEditable(oldTask, true)
          nameEdit.value = oldTask.name
          categoryEdit.value = oldTask.category
          descriptionEdit.value = oldTask.description
        } else {
          if (taskTouched.value == true) {
            const newTask: Task = {
              _id: oldTask._id,
              name: nameEdit.value,
              category: categoryEdit.value,
              description: descriptionEdit.value,
              contact: oldTask.contact,
              created: oldTask.created,
              edited: moment(),
              editable: false,
              locked: true
            }
    
            await taskStore.editRecord(
              oldTask, 
              newTask,
              '_id'
            )
            taskTouched.value = false
            // this closes the edit window by updating the refs after newTask editable set to false
            ctx.emit('update-tasks')
          } else {
            taskStore.toggleEditable(oldTask, false)
          }
        }
      }

      const updateField = (value: string, previous: string) => {
          if (previous) {
            taskTouched.value = true
          }
        }
      
      watch(
        () => nameEdit.value,
        (value: string, previous: string) => updateField(value, previous)
      )
      watch(
        () => categoryEdit.value,
        (value: string, previous: string) => updateField(value, previous)
      )
      watch(
        () => descriptionEdit.value,
        (value: string, previous: string) => updateField(value, previous)
      )
    //#endregion

    return {
      taskTouched,
      nameEdit,
      categoryEdit,
      descriptionEdit,
      modal,
      taskCardModal,
      openCard,
      cardIsOpen,
      deleteTask,
      toggleEditable,
      toggleDeletable,
      handleConfirmDelete
    }

  }
})
</script>

<style lang="scss">
</style>
