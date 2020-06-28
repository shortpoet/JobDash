<template>
  <tr>
    <component 
      v-for="(column, i) in columns" 
      :key="i"
      :props="propsComputed(column)"
      :is="componentComputed(column)"
    >
    </component>
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
import { ITableColumn, ITableColumnData, ITableColumnControl, BaseTableColumnControl, BaseTableColumnData } from './../../interfaces/table/table.interface'

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
      type: Array as () => ITableColumn[]
    }
  },

  components: {
    TableCellHeaderData,
    TableCellHeaderControl,
  },


  setup(props, ctx){
    const componentComputed = (column: ITableColumn) => {
      if (column instanceof BaseTableColumnControl) {
        return 'TableCellHeaderControl'
      }
      else if (column instanceof BaseTableColumnData) {
        return 'TableCellHeaderData'
      }
    }
    const propsComputed = (column: ITableColumn) => {
      if (column instanceof BaseTableColumnControl) {
        return {
          displayName: column.displayName,
          action: column.action
        }
      }
      else if (column instanceof BaseTableColumnData) {
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

