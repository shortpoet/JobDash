<template>
  <th>{{ controlName }}</th>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'

export default defineComponent({
  name: 'TableCellHeaderControl',

  props: {
    controlName: {
      type: String,
      required: true
    }
  },

  async setup(props, ctx){
    
    return {
    }

  }
})
</script>

