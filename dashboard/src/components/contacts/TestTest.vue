<template>
  <div class="test">
    Test
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from './../../store'

export default defineComponent({
  name: 'TestTest',

  async setup(){

    const store = useStore()

    console.log(store)

    if (!store.getState().contacts.loaded) {
      const contacts = await store.fetchContacts()
      console.log(contacts)
    }

  }

})
</script>

<style lang="scss">
</style>
