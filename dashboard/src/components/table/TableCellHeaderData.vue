<template>
  <th>{{ propertyName }}</th>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'

export default defineComponent({
  name: 'TableCellHeaderData',

  props: {
    propertyName: {
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

