<template>
  <th class="table-cell-header-data">{{ props.propertyName }}</th>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import { ITableColumnData } from '../../interfaces/table/table.interface'

export default defineComponent({
  name: 'TableCellHeaderData',

  props: {
    props: {
      type: Object as () => ITableColumnData,
      required: true
    }
  },

  setup(props, ctx){
    
    return {
    }

  }
})
</script>

