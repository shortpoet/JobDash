<template>
  <div class="card task-card form-container">
    <div class="task-card-header">
      <h5 class="form-heading">Task</h5>
      <button class="delete is-pulled-right" @click="modal.hideModal"></button>
    </div>
    <hr class="form-hr"/>
    <form action="submit" @submit.prevent="submit">
      <BaseInput type="text" name="Name" v-model="name" />
      <BaseInput type="text" name="Description" v-model="description" />
      <BaseInput type="text" name="Category" v-model="category" />
      <BaseInput type="text" name="ContactId" v-model="contactId" />
      <button class="button is-success">Save</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

import BaseInput from './../../components/common/BaseInput.vue'

import { Task } from '../../interfaces/task.interface'

import useTask from '../../composables/useTask'
import { useModal } from '../../composables/useModal'
import { useStore } from './../../store'

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

    const name = ref('name')
    const description = ref('description')
    const category = ref('category')

    const nameEdit = ref() 
    const descriptionEdit = ref() 
    const categoryEdit = ref()
    const taskTouched = ref(false)


    //#region modal
      const modal = useModal(props.destination)
    //#endregion

    //#region taskUse
      const store = useStore()
      const router = useRouter()
      const taskStore = store.modules['taskStore']
      console.log(router)
      // const task = taskStore.getTaskById()

    //#endregion

    const submit = async function(e: any) {
      console.log(props.destination)
      console.log(e)
    }

    const updateTable = () => {
    }

    return{
      name,
      description,
      category,
      submit,
      modal
    }

  }

})
</script>

<style lang="scss">
</style>
