<template>
  <div class="ui-collapse" @click="showComponent = !showComponent">
    <p>{{ componentName }}</p>
    <BaseIcon class="ui-collapse-icon" :name="'minus'" :color="'white'"/>
  </div>
  <div :class="`${classProp}`"  v-if="showComponent">
    <slot />
  </div>
  <div/>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, nextTick } from 'vue'
import BaseIcon from './BaseIcon.vue'

export default defineComponent({
  name: 'BaseMinimize',
  props: {
    classProp: {
      type: String,
      default: ''
    },
    componentName: {
      type: String,
      required: false
    }
  },
  components: {
    BaseIcon
  },
  async setup(props, ctx) {
    const showComponent = ref(true)
    return {
      showComponent
    }

  }
})
</script>

