<template>
  <!-- <tr
    v-for="item in items"
    :key="item[props.idSymbol]"
  > -->
  <tr>
    <component 
      v-for="(column, i) in columns" 
      :key="i"
      :is="componentComputed(column)"
      :props="propsComputed(column, item)"
    />
  </tr>
    <!-- <BaseTableCellData
      v-for="item in items"
      :key="item.id">
    />
    <BaseTableCellControl
      v-for="item in items"
      :key="item.id"
      @handle-click="handleClick(item)"
    /> -->
</template>

<script lang="ts">
import moment from 'moment'
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import BaseTableCellData from './../table/BaseTableCellData.vue'
import BaseTableCellControl from './../table/BaseTableCellControl.vue'
import TableCellControlDelete from './../table/TableCellControlDelete.vue'
import { ITableControl, ITableData, BaseTableData, BaseTableControl, ID, DELETE, EDIT, MESSAGE, LOCKED } from '../../interfaces/table/table.interface'
import { colorLog } from '../../utils'
export default defineComponent({
  name: 'TableRowBody',

  props: {
    // props: {
    //   type: Object,
    //   required: true
    // },

    item: {
      type: Object,
      required: true
    },
    columns: {
      type: Array as () => (ITableControl|ITableData)[]
    },
    class: {
      type: String,
      required: true
    }
    // idSymbol: {
    //   type: String,
    //   required: true
    // },
    // itemType: {
    //   type: String,
    //   required: true
    // }
  },

  components: {
    BaseTableCellData,
    BaseTableCellControl,
    TableCellControlDelete
  },

  emits: ['update-contacts'],

  async setup(props, ctx){

    const componentComputed = (column: (ITableControl|ITableData)) => {
      // console.log(column.displayName)
      if (column instanceof BaseTableControl) {
        if (column.displayName == 'Locked') {
          return 'TableCellControlDelete'
        } else {
          return 'BaseTableCellControl'
        }
        return 'BaseTableCellControl'
      }
      else if (column instanceof BaseTableData) {
        // console.log(column.displayName)
        // if (column.displayName == 'Locked') {
        //   colorLog('locked', 'orange', 'green')
        //   return 'TableCellControlDelete'
        // } else {
        //   return 'BaseTableCellData'
        // }
        return 'BaseTableCellData'
      }
    }
      const getIconConfig = (column): Record<string, string> => {
        let out = {}
        switch (column.displayName) {
          case ID:
            out['color'] = 'purple'
            out['controlIcon'] = 'external-link'
            break
          case DELETE:
            out['color'] = 'red'
            out['controlIcon'] = 'trash-2'
            break
          case EDIT:
            out['color'] = 'blue'
            out['controlIcon'] = 'edit'
            break
          case LOCKED:
            out['color'] = 'yellow'
            out['controlIcon'] = ''
            break
          case MESSAGE:
            out['color'] = 'green'
            out['controlIcon'] = 'mail'
            break
          }
        return out
      }
    colorLog('table row body', 'orange', 'green')
    // console.log(props.columns)
    const propsComputed = (column: (ITableControl|ITableData)) => {
      if (column instanceof BaseTableControl) {
        return {
          displayName: column.displayName,
          color: getIconConfig(column).color,
          controlIcon: getIconConfig(column).controlIcon,
          action: column.action,
          propertyData: props.item
        }
      }
      else if (column instanceof BaseTableData) {
        return {
          propertyName: column.propertyName,
          propertyData: props.item
        }
      }
    }
    
    return {
      handleClick: () => {},
      componentComputed,
      propsComputed
    }

  }
})
</script>

<style lang="scss">
</style>
