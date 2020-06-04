<template>
  <!--
    * watch for nested section.section
    * will start nesting relative padding (I think)
  -->
  <section class="tabs-section">
    <div class="tabs">
      <ul>
        <li
          v-for="(tab, i) in tabs"
          :key="i"
          @click="activateTab"
        ><a>
          {{ tab.name }}
        </a></li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

export default defineComponent({
  name: 'ContactTabs',

  components: {
  },

  props:{
    tabs: {
      type: Array,
      required: true
    }
  },

  setup(props, ctx) {
    const activateTab = (event: any) => {
      console.log(event.target.value)
      ctx.emit('update:modelValue', event.target.value)
    }
    return {
      activateTab
    }
  }

})
</script>

<style lang="scss">
</style>
