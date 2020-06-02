<template>
  <div class="columns">
    <div class="column is-one-half">
      <form action="submit" @submit.prevent="submit">
        <BaseInput type="text" name="Name" v-model="name" />
        <BaseInput type="text" name="Company" v-model="company" />
        <BaseInput type="email" name="Email" v-model="email" />
        <button class="button is-success">Submit</button>
      </form>
    </div>
    <div class="column is-one-half"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from './../../store'
import BaseInput from './../../components/common/BaseInput.vue'
export default defineComponent({
  name: 'ContactEntry',

  components: {
    BaseInput
  },

  async setup(){

    const name = ref('name')
    const company = ref('company')
    const email = ref('email')

    const store = useStore()

    console.log(store)

    if (!store.getState().contacts.loaded) {
      const contacts = await store.fetchContacts()
      console.log(contacts)
    }

    const submit = () => {}

    return{
      name,
      company,
      email,
      submit
    }

  }

})
</script>

<style lang="scss">
</style>
