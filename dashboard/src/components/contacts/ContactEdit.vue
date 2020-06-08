<template>
  <div class="columns">
    <div class="column is-one-half">
      <form action="submit" @submit.prevent="submit">
        <BaseInput type="text" name="Name" v-model="name" />
        <BaseInput type="text" name="Company" v-model="company" />
        <BaseInput type="text" name="Email" v-model="email" />
        <button class="button is-success">Edit</button>
      </form>
    </div>
    <div class="column is-one-half"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useContactStore } from './../../store/contact.store'
import BaseInput from './../../components/common/BaseInput.vue'
import { Contact } from '../../interfaces/contact.interface'
import moment from 'moment'
export default defineComponent({
  name: 'ContactEntry',

  components: {
    BaseInput
  },

  async setup(props, ctx){

    const name = ref('name')
    const company = ref('company')
    const email = ref('email')

    const contactStore = useContactStore()

    const submit = (e: any) => {
      ctx.emit('contact-edit')
    }

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
