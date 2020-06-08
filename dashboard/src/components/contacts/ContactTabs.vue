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
          @click="activateTab(tab)"
          :class="{'is-active': activeTab === tab.name}"
        ><a>
          {{ tab.name }}
        </a></li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { Tab } from '../../interfaces/tab.interface'

export default defineComponent({
  name: 'ContactTabs',

  components: {
  },

  props:{
    tabs: {
      type: Array,
      required: true
    },
    activeTab: {
      type: String,
      required: true
    }
  },

  setup(props, ctx) {
    const activateTab = (tab: Tab) => {
      console.log(tab.component)
      ctx.emit('update:modelValue', tab.component)
      // can't use this here because it ends up only changing once or you update the name of the tab
      // ctx.emit('update:modelValue', tab.component)
      ctx.emit('tab-activated', tab)
    }
    return {
      activateTab
    }
  }

})
</script>

<style lang="scss">
</style>
