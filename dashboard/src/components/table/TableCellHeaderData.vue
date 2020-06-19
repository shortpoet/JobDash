<template>
  <th class="table-cell-header-data">{{ props.propertyName }}</th>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import { ITableData } from '../../interfaces/table/table.interface'

export default defineComponent({
  name: 'TableCellHeaderData',

  props: {
    props: {
      type: Object as () => ITableData,
      required: true
    }
  },

  async setup(props, ctx){
    
    return {
    }

  }
})
</script>

