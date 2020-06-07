<template>
<section class="section task-create">
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
</section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useTaskStore } from './../../store/task.store'
import BaseInput from './../../components/common/BaseInput.vue'
import { Task } from '../../interfaces/task.interface'
import moment from 'moment'
import { Contact } from '../../interfaces/contact.interface'
import { useContactStore } from '../../store/contact.store'
export default defineComponent({
  name: 'TaskCreate',

  components: {
    BaseInput
  },

  async setup(props, ctx){

    const name = ref('name')
    const description = ref('description')
    const category = ref('category')
    const contactId = ref(null)
    const contact = ref<Contact>()

    const taskStore = useTaskStore()

    const contactStore = useContactStore()

    contact.value = await useContactStore().geContactById(contactId)

    const submit = async function(e: any) {
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
      ctx.emit('update-tasks')
    }

    const updateTable = () => {
    }

    return{
      name,
      category,
      description,
      contact,
      submit
    }

  }

})
</script>

<style lang="scss">
</style>
