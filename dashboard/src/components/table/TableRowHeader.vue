<template>
  <tr>
    <component 
      v-for="(column, i) in columns" 
      :key="i"
      :props="propsComputed(column)"
      :is="componentComputed(column)"
    />
    <!-- <TableCellHeaderData
      v-for="prop in dataProperties" 
      :key="prop"
      :property-name="prop"
    />
    <TableCellHeaderControl
      v-for="control in controlTypes" 
      :key="control"
      :display-name="control.displayName"
    /> -->
  </tr>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import TableCellHeaderData from './TableCellHeaderData.vue'
import TableCellHeaderControl from './TableCellHeaderControl.vue'
import { ITableControl, ITableData, BaseTableConfig, BaseTableControl, BaseTableData } from './../../interfaces/table/table.column.interface'

export default defineComponent({
  name: 'TableRowHeader',

  props: {
    dataProperties: {
      type: Array,
      required: true
    },
    controlTypes: {
      type: Array as () => Record<string, string>[],
      required: true
    },
    columns: {
      type: Array as () => (ITableControl|ITableData)[]
    }
  },

  components: {
    TableCellHeaderData,
    TableCellHeaderControl,
  },


  async setup(props, ctx){
    const componentComputed = (column: (ITableControl|ITableData)) => {
      if (column instanceof BaseTableControl) {
        return 'TableCellHeaderControl'
      }
      else if (column instanceof BaseTableData) {
        return 'TableCellHeaderData'
      }
    }
    const propsComputed = (column: (ITableControl|ITableData)) => {
      if (column instanceof BaseTableControl) {
        return {
          displayName: column.displayName,
          action: column.action
        }
      }
      else if (column instanceof BaseTableData) {
        return {
          propertyName: column.propertyName
        }
      }
    }

    return {
      componentComputed,
      propsComputed
    }

  }
})
</script>

