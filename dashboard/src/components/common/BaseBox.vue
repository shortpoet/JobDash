<template>
  <div :class="scrollable ? 'box my-box scrollable-box' : 'box my-box' " :style="styleComputed">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: "BaseBox",
  props: {
    scrollable: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const style = ref()
    const styleComputed = computed(() => {
      return `height: ${props.height}`
    })
    return {
      styleComputed
    }
  }
  
})
</script>
