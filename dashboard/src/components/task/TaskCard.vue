<template>
  <div class="card task-card form-container" v-if="loaded">
    <div class="task-card-header">
      <h5 class="form-heading">Task</h5>
      <button class="delete is-pulled-right" @click="handleModalClose"></button>
    </div>
    <hr class="form-hr"/>
    <form action="submit" @submit.prevent="submit">
      <BaseInput type="text" name="Id" :readonly="true" v-model="taskEdit._id" />
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
import moment from 'moment'
import { useRouter, Router } from 'vue-router'
import { useStore } from './../../store'
import { TaskStore } from '../../store/task.store'

import BaseInput from './../../components/common/BaseInput.vue'

import { ITask } from '../../interfaces/task/task.interface'

import { useModal } from '../../composables/useModal'
import { useUpdateValues } from '../../composables/useUpdateValues'

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



    //#region initValues
      const id = ref('')
      const task = ref<ITask>()
      const nameEdit = ref()
      const descriptionEdit = ref()
      const categoryEdit = ref()

      const taskEdit = ref<ITask>()
      const taskTouched = ref(false)

      const loaded = ref(false)

      const store = useStore()
      const router: Router = useRouter()
      const taskStore: TaskStore = store.modules['taskStore']
      // need this otherwise router is a step behind
      setTimeout(() => {
        id.value =  typeof(router.currentRoute.value.params.id) == 'string' ? router.currentRoute.value.params.id : router.currentRoute.value.params.id[0]
        task.value = taskStore.getRecordById(id.value)
        nameEdit.value = task.value.name
        descriptionEdit.value = task.value.description
        categoryEdit.value = task.value.category
        taskEdit.value = {...task.value}
        loaded.value = true
      }, .1)  
    //#endregion

    //#region modal
      const modal = useModal(props.destination)

      const handleModalClose = () => {modal.hideModal(); router.push('/')}

      const cardIsOpen = computed(() => {
        const open = router.currentRoute.value.name === props.destination
        // console.log('card is open')
        // console.log(open)
        return open
      })

      // console.log('init task card')
      if (cardIsOpen) {
        modal.showModal()
      }
    //#endregion

    //#region updateValues
      useUpdateValues(taskTouched, [nameEdit, descriptionEdit, categoryEdit])
    
      const submit = async function(e: any) {
        if (taskTouched.value == true) {
          taskEdit.value.name = nameEdit.value
          taskEdit.value.description = descriptionEdit.value
          taskEdit.value.category = categoryEdit.value
          await taskStore.editRecord(
            task.value, 
            taskEdit.value,
            '_id'
          )
          taskTouched.value = false
          ctx.emit('update-tasks')
        }
        handleModalClose()
      }
    //#endregion

    return{
      loaded,
      nameEdit,
      descriptionEdit,
      categoryEdit,
      submit,
      modal,
      taskEdit,
      cardIsOpen,
      handleModalClose
    }

  }

})
</script>

<style lang="scss">
</style>
