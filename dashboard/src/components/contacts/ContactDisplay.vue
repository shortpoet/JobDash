<template>
  <div class="menu">
    <p class="menu-label"></p>
    <ul class="menu-list">
      <li
        v-for="contact in allContacts"
        :key="contact._id"
      ><a href="">{{ contact.name }}</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from './../../store'
import BaseInput from './../../components/common/BaseInput.vue'
import { Contact } from '../../interfaces/contact.interface'
import moment from 'moment'
export default defineComponent({
  name: 'ContactDisplay',

  components: {
    BaseInput
  },


  async setup(){

    const store = useStore()

    // console.log(store)

    if (!store.getState().contacts.loaded) {
      await store.fetchContacts()
    }

    const allContacts = store.getState().contacts.ids.reduce<Contact[]>((accumulator, id) => {
      const post = store.getState().contacts.all[id]
      return accumulator.concat(post)
    }, [])

    console.log(allContacts)

    return{
      allContacts
    }

  }

})
</script>

<style lang="scss">
</style>
