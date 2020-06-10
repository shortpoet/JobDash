<template>
  <div class="card task-card form-container">
    <div class="task-card-header">
      <h5 class="form-heading">Task</h5>
      <button class="delete is-pulled-right" @click="modal.hideModal"></button>
    </div>
    <hr class="form-hr"/>
    <form action="submit" @submit.prevent="submit">
      <BaseInput type="text" name="Name" v-model="nameEdit" />
      <BaseInput type="text" name="Description" v-model="descriptionEdit" />
      <BaseInput type="text" name="Category" v-model="categoryEdit" />
      <BaseInput type="text" name="Contact Id" :readonly="true" v-model="taskEdit.contact._id" />
      <button class="button is-success">Save</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useRouter, Router } from 'vue-router'
import moment from 'moment'

import BaseInput from './../../components/common/BaseInput.vue'

import { Task } from '../../interfaces/task.interface'

import useTask from '../../composables/useTask'
import { useModal } from '../../composables/useModal'
import { useStore } from './../../store'
import { TaskStore } from '../../store/task.store'

export default defineComponent({
  name: 'TaskCard',

  props: {
    destination: {
      type: String,
      required: true
    }
  },

  components: {
    BaseInput
  },

  emits: ['update-tasks'],

  async setup(props, ctx){

    //#region modal
      const modal = useModal(props.destination)
    //#endregion

    //#region taskUse
      const store = useStore()
      const router: Router = useRouter()
      const taskStore: TaskStore = store.modules['taskStore']
      const id: string = typeof(router.currentRoute.value.params.id) == 'string' ? router.currentRoute.value.params.id : router.currentRoute.value.params.id[0]
      const task: Task = taskStore.getRecordById(id)
    //#endregion

    //#region initValues
      const nameEdit = ref()
      const descriptionEdit = ref()
      const categoryEdit = ref()

      nameEdit.value = task.name
      descriptionEdit.value = task.description
      categoryEdit.value = task.category

      const taskEdit = ref<Task>({...task})

      const taskTouched = ref(false)

    //#endregion

    //#region updateValues
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
    const submit = async function(e: any) {
      if (taskTouched.value == true) {
        taskEdit.value.name = nameEdit.value
        taskEdit.value.description = descriptionEdit.value
        taskEdit.value.category = categoryEdit.value
        await taskStore.editRecord(
          task, 
          taskEdit.value,
          '_id'
        )
        taskTouched.value = false
        ctx.emit('update-tasks')
      }
      modal.hideModal()
    }

    return{
      nameEdit,
      descriptionEdit,
      categoryEdit,
      submit,
      modal,
      taskEdit
    }

  }

})
</script>

<style lang="scss">
</style>
