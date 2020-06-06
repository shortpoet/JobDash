<template>
  <!--
    * https://bulma.io/documentation/layout/section/
    * adding class secion to section tag creates default padding
    * which can be modified using scss vars
    * * $section-padding
    * * $section-padding-medium
    * * $section-padding-large
  -->

  <BaseModal :style="modalDisplay" :isActive="modal.visible">
    <template #destination>
      <div class="" id="modal-warning">
      </div>
    </template>
  </BaseModal>

  <section class="section section-container">
    <div class="container">
      <router-view />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { provideStore } from './store'
import BaseModal from './components/common/BaseModal.vue'
import { useModal } from './composables/useModal'

export default defineComponent({
  name: 'App',

  components: {
    BaseModal
  },

  setup(props, ctx) {
    const modal = useModal()
    provideStore()

    const modalDisplay = computed(() => ({
      // display: modal.visible.value ? 'block' : 'none'
    }))

    return {
      modal,
      modalDisplay
    }

  }

})
</script>

<style lang="scss">

</style>
