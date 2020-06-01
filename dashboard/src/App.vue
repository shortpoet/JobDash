<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { provideStore } from './store'

export default defineComponent({
  name: 'App',

  setup() {
    provideStore()
  }

})
</script>

<style lang="scss">

</style>
