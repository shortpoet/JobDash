<template>
  <div class="form-container">
    <h5 class="form-heading">Task</h5>
    <hr class="form-hr"/>
    <form action="submit" @submit.prevent="submit">
      <BaseInput type="text" name="Name" v-model="name" />
      <BaseInput type="text" name="Description" v-model="description" />
      <BaseInput type="text" name="Category" v-model="category" />
      <BaseInput type="text" name="Contact Id" v-model="contactId" />
      <button class="button is-success">Create</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import moment from 'moment'

import { useStore } from '../../store'
import { TaskStore } from './../../store/task.store'
import { ContactStore } from './../../store/contact.store'

import BaseInput from './../../components/common/BaseInput.vue'

import { ITask } from '../../interfaces/task/task.interface'
import { IContact } from '../../interfaces/contact/contact.interface'


export default defineComponent({
  name: 'TaskCreate',

  components: {
    BaseInput
  },

  emits: ['update-tasks'],

  async setup(props, ctx){

    const name = ref('name')
    const description = ref('description')
    const category = ref('category')
    const contactId = ref('0')
    // const contact = ref<IContact>()

    const store = useStore()

    //#region taskUse
      const taskStore: TaskStore = store.modules['taskStore']

      // const iTaskStore: ITaskStore = {
      //   taskStore: taskStore
      // }

      const allTasks = ref<ITask[]>([])
      const loading = ref(true)
      allTasks.value = await taskStore.loadRecords('task')
      loading.value = false

      // is this correct usage of provide/inject
      // const taskUse = await useTask(iTaskStore, allTasks)

    //#endregion

    //#region contactUse
      const contactStore: ContactStore = store.modules['contactStore']
    //#endregion

    const submit = async function(e: any) {
      const _contact: IContact = await contactStore.getRecordById(contactId.value)
      if (_contact) {
        // const contact: IContact = {
        //   _id: _contact._id,
        //   name: _contact.name,
        //   company: _contact.company,
        //   email: _contact.email,
        //   created: _contact.created,
        //   edited: _contact.edited,
        //   editable: _contact.editable,
        //   locked: _contact.locked
        // }
        const nextId = (parseInt(taskStore.getLastId()) + 1).toString()
        console.log(nextId)
        const task: ITask = {
          _id: nextId,
          itemId: nextId,
          name: name.value,
          category: category.value,
          description: description.value,
          contact: _contact,
          created: moment(),
          edited: moment(),
          editable: false,
          locked: true
        }
        await taskStore.createRecord(task)
        ctx.emit('update-tasks')
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
      submit,
      contactId
    }

  }

})
</script>

<style lang="scss">
</style>
