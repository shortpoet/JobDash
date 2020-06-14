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

      <td class="has-text-left id-cell" @click="openCard(task)">
        <BaseIcon name="external-link" color="purple">{{ task._id }}</BaseIcon>
      </td>

      <td v-if="task.editable" contenteditable>
        <BaseInput type="text" name="Name" v-model="nameEdit" />
          {{ nameEdit }}
      </td>
      <td class="has-text-centered" v-else>{{ task.name }}</td>

      <td v-if="task.editable" contenteditable>
        <BaseInput type="text" name="Category" v-model="categoryEdit" />
          {{ categoryEdit }}
      </td>
      <td class="has-text-centered" v-else>{{ task.category }}</td>

      <td v-if="task.editable" contenteditable>
        <BaseInput type="text" name="Category" v-model="descriptionEdit" />
          {{ descriptionEdit }}
      </td>
      <td class="has-text-centered" v-else>{{ task.description }}</td>

      <td class="has-text-centered">{{ task.contact._id }}</td>

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

  <teleport to="#task-card-modal" v-if="taskCardModal.visible && targetsLoaded">
    <TaskCard @update-tasks="updateTasks" :destination="'#task-card-modal'"/>
  </teleport>

  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import moment from 'moment'
import { useStore } from '../../store'
import { useRouter } from 'vue-router'
import { StoreConstructor } from '../../store/store.interface'
import { TaskStore } from '../../store/task.store'
import { useUpdateValues } from '../../composables/useUpdateValues'

import BaseInput from './../../components/common/BaseInput.vue'
import BaseIcon from './../../components/common/BaseIcon.vue'
import ModalWarning from './../../components/common/ModalWarning.vue'
import TaskCard from './TaskCard.vue'


import { Task } from '../../interfaces/task/task.interface'
import { Field } from '../../interfaces/common/field.interface'
import { Destination } from '../../interfaces/common/modal.interface'

import { useModal } from '../../composables/useModal'
import useTask from '../../composables/useTask'


export default defineComponent({
  name: 'TaskTable',

  props: {
    tasks: {
      // type: Object.prototype.constructor(taskStore),
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

    onMounted(() => {
      // const tasks: Task[] = props.tasks.forEach(task => {
      //   console.log(task.contact)
      // })
    })


    const store = useStore()
    const taskStore: TaskStore = store.modules['taskStore']



    //#region taskCardModal

      const taskCardDestination: Destination = '#task-card-modal'

      const targetsLoaded = computed(() => {
        // console.log('target loaded')
        const out = !!document.querySelector(destination)
        // console.log(out)
        return out
      })

      const taskCardModal = useModal(taskCardDestination)

    //#endregion

    //#region openCard
      const router = useRouter()
      const openCard = (task: Task) => {
        // console.log('task table')
        // console.log(task._id)
        taskCardModal.showModal()
        router.push({
          name: '#task-card-modal',
          path: `/task/${task._id}`,
          params: { id: task._id } 
        })
      }
    //#endregion

    //#region updateTasks
      const updateTasks = () => ctx.emit('update-tasks')
    //#endregion

    //#region taskUse
      // const taskStore: TaskStore = store.modules['taskStore']
      // Object.prototype.constructor(taskStore)
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
            // console.log('delete task')
            deleteCandidate.value._id == deletedId ? deleteCandidate.value = null : ''
            // null check
            // console.log(deleteCandidate.value)
            ctx.emit('update-tasks')
          }          
        } else {
          const deletedId = await taskStore.deleteRecord(deleteCandidate.value)
          // console.log('delete task')
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
      
      //#region updateValues
        const taskTouched = ref(false)
        useUpdateValues(taskTouched, [nameEdit, descriptionEdit, categoryEdit])
      //#endregion

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
              itemId: oldTask._id,
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

    //#endregion

    return {
      taskTouched,
      nameEdit,
      categoryEdit,
      descriptionEdit,
      modal,
      targetsLoaded,
      taskCardModal,
      openCard,
      updateTasks,
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
