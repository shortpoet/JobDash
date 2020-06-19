<template>
  <th>{{ props.displayName }}</th>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import { ITableControl } from '../../interfaces/table/table.interface'

export default defineComponent({
  name: 'TableCellHeaderControl',

  props: {
    props: {
      type: Object as () => ITableControl,
      required: true
    }
  },

  async setup(props, ctx){
    
    return {
    }

  }
})
</script>

