<template>
  <table class="table is-hoverable">
    <thead>
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Category</th>
        <th>Description</th>
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
    
      <!--
        Using a component here createD a bug
        update: no longer; wonder what the issue with my code
      -->

      <!-- <TaskRow :task="task" @update-tasks="updateTasks" /> -->

      <td>{{ task._id }}</td>

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

  <!-- 
    TODO
    differentiate between modals visible methods
    #TODO
  -->

  <teleport to="#modal-warning" v-if="modal.visible">
    <ModalWarning @delete-task="deleteTask"/>
  </teleport>


  <div />
    <!-- <Suspense>
      <template #default>

      </template>
      <template #fallback>

      </template>
    </Suspense> -->
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useTaskStore } from './../../store/task.store'
import BaseInput from './../../components/common/BaseInput.vue'
import BaseIcon from './../../components/common/BaseIcon.vue'
import ModalWarning from './../../components/common/ModalWarning.vue'
import { Task } from '../../interfaces/task.interface'
import { Field } from '../../interfaces/field.interface'
import moment from 'moment'
import { useModal } from '../../composables/useModal'
import { TableItem } from '../../interfaces/table.item.interface'

export default defineComponent({
  name: 'TaskTable',

  props: {
    items: {
      type: Array,
      required: true
    }
  },

  components: {
    BaseInput,
    ModalWarning,
    BaseIcon
  },

  emits: ['update-items', 'toggle-deletable', 'delete-item', 'edit-item'],

  async setup(props, ctx){

    const updateItems = () => {
      ctx.emit('update-items')
    }

    //#region dataParse
      const parseFields = (datum, casing, sortable) => {
        var sort = []
        if (sortable == null) {
          sort = Object.keys(datum).map(x => true)
        } else {
          sort = sortable
        }
        if (typeof datum === 'object' && datum !== null) {
          return Object.keys(datum).map((x, i) => ({
            'key': x,
            'label': x,
            'sortable': sort[i]
          }))
        } else {
          throw new TypeError('This function is for an object')
        }
      }
      

    //#endregion

    // #region global
      const taskStore = useTaskStore()
    // #endregion

    //#region delete
      const confirmDelete = ref(false)
      const deleteCandidate = ref<TableItem>(null)
      const modal = useModal()

      const handleConfirmDelete = (item: TableItem) => {
        if (item.locked) {
          deleteCandidate.value = item
          modal.showModal()
        } else {
          deleteCandidate.value = item
          deleteItem()
        }
      }
      
      const deleteItem = () => {
        modal.hideModal()
        console.log('delete table item')
        ctx.emit('delete-item', deleteCandidate.value)
        deleteCandidate.value = null
      }
      
      const toggleDeletable = async (item: TableItem) => {
        if (item.locked == false) {
          ctx.emit('toggle-deletable', {item: item, toggle: true})
        } else {
          ctx.emit('toggle-deletable', {item: item, toggle: false})
        }
      }
    //#endregion

    //#region edit
      const nameEdit = ref() 
      const categoryEdit = ref() 
      const descriptionEdit = ref()

      const itemTouched = ref(false)

      const toggleEditable = async (oldItem: TableItem) => {
        if (oldItem.editable == false) {
          ctx.emit('toggle-deletable', {item: oldItem, toggle: true})
          // this could be done with array index of fields or a mapping of some sort maybe
          // nameEdit.value = oldTask.name
          // categoryEdit.value = oldTask.category
          // descriptionEdit.value = oldTask.description
        } else {
          if (itemTouched.value == true) {
            ctx.emit('edit-item', oldItem)
            itemTouched.value = false
          } else {
            ctx.emit('toggle-deletable', {item: oldItem, toggle: false})
          }
        }
      }

      const updateField = (value: string, previous: string) => {
          if (previous) {
            itemTouched.value = true
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
      updateTasks,
      taskTouched,
      nameEdit,
      categoryEdit,
      descriptionEdit,
      deleteTask,
      toggleEditable,
      toggleDeletable,
      modal,
      handleConfirmDelete
    }

  }
})
</script>

<style lang="scss">
</style>
