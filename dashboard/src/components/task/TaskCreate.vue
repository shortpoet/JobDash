<template>
  <div class="form-container">
    <h5 class="form-heading">Task</h5>
    <hr class="form-hr"/>
    <form action="submit" @submit.prevent="submit">
      <BaseInput type="text" name="Name" v-model="name" />
      <BaseInput type="text" name="Description" v-model="description" />
      <BaseInput type="text" name="Category" v-model="category" />
      <BaseInput type="text" name="ContactId" v-model="contactId" />
      <button class="button is-success">Create</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

import { useTaskStore, ITaskStore } from './../../store/task.store'
import { useContactStore, IContactStore } from './../../store/contact.store'
import { Task } from '../../interfaces/task.interface'
import { Contact } from '../../interfaces/contact.interface'

import BaseInput from './../../components/common/BaseInput.vue'

import moment from 'moment'
import useTask from '../../composables/useTask'
import useContact from '../../composables/useContact'
import { useStore } from '../../store'

export default defineComponent({
  name: 'TaskCreate',

  components: {
    BaseInput
  },

  async setup(props, ctx){

    const name = ref('name')
    const description = ref('description')
    const category = ref('category')
    const contactId = ref('')
    const contact = ref<Contact>()

    const store = useStore()

    //#region taskUse
      const taskStore = store.modules['taskStore']

      // const iTaskStore: ITaskStore = {
      //   taskStore: taskStore
      // }

      const allTasks = ref<Task[]>([])

      // is this correct usage of provide/inject
      // const taskUse = await useTask(iTaskStore, allTasks)
      const taskUse = await useTask(taskStore, allTasks)

      const onUpdateTasks = taskUse.onUpdateTasks
    //#endregion

    //#region contactUse
      const contactStore = store.modules['contactStore']

      const allContacts = ref<Contact[]>([])

      const contactUse = await useContact(contactStore, allContacts)

      const onUpdateContacts = contactUse.onUpdateContacts
    //#endregion

    const submit = async function(e: any) {
      contact.value = await contactStore.getContactById(contactId.value)
      if (contact.value) {
        // console.log(store.getLastId())
        const nextId = (parseInt(taskStore.getLastId()) + 1).toString()
        // console.log(nextId)
        const task: Task = {
          _id: nextId,
          name: name.value,
          category: category.value,
          description: description.value,
          contact: contact.value,
          created: moment(),
          edited: moment(),
          editable: false,
          locked: true
        }
        await taskStore.createTask(task)
        console.log('create task')
        onUpdateTasks()
        // ctx.emit('update-tasks')
      } else {
        throw new Error(`Contact with Id - ${contactId.value} - does not exist yet`)
      }

    }

    const updateTable = () => {
    }

    return{
      name,
      category,
      description,
      contact,
      submit,
      contactId
    }

  }

})
</script>

<style lang="scss">
</style>
