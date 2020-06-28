<template>
  <div class="minimize-container">
    <div class="ui-collapse" @click="handleChange">
      <p>{{ componentName }}</p>
      <BaseIcon class="ui-collapse-icon" :name="'minus'" :color="'white'"/>
    </div>
    <div :class="`${classProp}`"  v-if="showComponent">
      <slot />
    </div>
  </div>
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
    },
    minimized: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BaseIcon
  },
  emits: ['minimize-change'],
  setup(props, ctx) {
    const showComponent = ref(!props.minimized)
    const handleChange = () => {
      showComponent.value = !showComponent.value
      ctx.emit('minimize-change', {minimized: !showComponent.value, componentName: props.componentName})
    }
    return {
      showComponent,
      handleChange
    }

  }
})
</script>

