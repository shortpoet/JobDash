<template>
  <!--
    * https://bulma.io/documentation/layout/section/
    * adding class secion to section tag creates default padding
    * which can be modified using scss vars
    * * $section-padding
    * * $section-padding-medium
    * * $section-padding-large
  -->

  <ModalLayout />

  <section class="section section-container">
    <div class="">
      <router-view />
    </div>
  </section>
  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { provideStore } from './store'
import ModalLayout from './views/ModalLayout.vue'

export default defineComponent({
  name: 'App',

  components: {
    ModalLayout
  },

  setup(props, ctx) {
    provideStore()

    const modalDisplay = computed(() => ({
      // display: modal.visible.value ? 'block' : 'none'
    }))

    return {
      modalDisplay
    }

  }

})
</script>

<style lang="scss">

</style>
