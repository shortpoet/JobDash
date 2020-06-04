<template>
  <!--
    * https://bulma.io/documentation/layout/section/
    * adding class secion to section tag creates default padding
    * which can be modified using scss vars
    * * $section-padding
    * * $section-padding-medium
    * * $section-padding-large
  -->
  <section class="section section-container">
    <div class="container">
      <router-view />
    </div>
  </section>
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
