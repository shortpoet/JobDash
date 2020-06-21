<template>
  <tr>
    <component 
      v-for="(column, i) in columns" 
      :key="i"
      :is="componentComputed(column)"
      :props="propsComputed(column, item)"
      @handle-delete="handleDelete"
      @handle-click="handleClick"
      @handle-input-edit="handleInputEdit"
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
import { defineComponent, computed, ref, watch, onMounted, onUpdated } from 'vue'
import BaseTableCellData from './../table/BaseTableCellData.vue'
import BaseTableCellControl from './../table/BaseTableCellControl.vue'
import TableCellControlDelete from './../table/TableCellControlDelete.vue'
import TableCellDataEditable from './../table/TableCellDataEditable.vue'
import { useDelete } from './../../composables/table/useDelete'
import { ITableControl, ITableData, BaseTableData, BaseTableControl, ID, DELETE, EDIT, MESSAGE, LOCKED, ACTION_DELETE, ACTION_EDIT, ACTION_LOCKED } from '../../interfaces/table/table.interface'
import { colorLog } from '../../utils'
export default defineComponent({
  name: 'TableRowBody',

  props: {
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
    },
    editableColumns: {
      type: Array,
      required: true
    },
    itemUnderEdit: {
      type: Boolean,
      default: false
    }
  },

  components: {
    BaseTableCellData,
    BaseTableCellControl,
    TableCellControlDelete,
    TableCellDataEditable
  },

  emits: [
    'handle-delete',
    'handle-toggle-delete',
    'handle-toggle-edit',
    'handle-input-edit'
  ],

  async setup(props, ctx){
    onUpdated(() => {
      // colorLog('on updated table row body', 'red', 'yellow')
    })
  //#region component and props
    const componentComputed = (column: (ITableControl|ITableData)) => {
      // console.log(column.displayName)
      if (column instanceof BaseTableControl) {
        if (column.displayName == 'Locked') {
          return 'TableCellControlDelete'
        } else {
          return 'BaseTableCellControl'
        }
      }
      else if (column instanceof BaseTableData) {
        if (props.editableColumns.includes(column.propertyName)) {
          return 'TableCellDataEditable'
        }
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
    // colorLog('table row body', 'orange', 'green')
    const propsComputed = (column: (ITableControl|ITableData)) => {
      if (column instanceof BaseTableControl) {
        return {
          displayName: column.displayName,
          color: getIconConfig(column).color,
          controlIcon: getIconConfig(column).controlIcon,
          action: column.action,
          propertyData: props.item,
          editableColumns: props.editableColumns
        }
      }
      else if (column instanceof BaseTableData) {
        return {
          propertyName: column.propertyName,
          propertyData: props.item,
          editableColumns: props.editableColumns,
          itemUnderEdit: props.itemUnderEdit
        }
      }
    }

  //#endregion
    // all controls emit click (i think)
    const handleClick = (e) => {
      console.log(e)
      console.log(e.action)
      switch(e.action) {
        case ACTION_LOCKED:
          ctx.emit('handle-toggle-delete', e.item)
          break
        case ACTION_DELETE:
          ctx.emit('handle-delete', e.item)
          break
        case ACTION_EDIT:
          ctx.emit('handle-toggle-edit', {item: e.item, editableColumns: props.editableColumns})
          break
      }
    }
    // this is emitted from data editable cell
    const handleInputEdit = (e) => {
      // colorLog('handle input edit', 'red', 'yellow')
      ctx.emit('handle-input-edit', e)
    }

    return {
      handleClick,
      handleDelete: (item) => ctx.emit('handle-delete', item),
      handleInputEdit,
      componentComputed,
      propsComputed,
    }

  }
})
</script>

<style lang="scss">
</style>
