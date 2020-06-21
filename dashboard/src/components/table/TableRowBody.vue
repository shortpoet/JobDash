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
import { ITableControl, ITableData, BaseTableData, BaseTableControl, ID, DELETE, EDIT, MESSAGE, LOCKED, ACTION_DELETE, ACTION_EDIT } from '../../interfaces/table/table.interface'
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
    },
    editableColumns: {
      type: Array,
      required: true
    },
    editRefs: {
      type: Array,
      required: false
    },
    itemUnderEdit: {
      type: Boolean,
      default: false
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
    TableCellControlDelete,
    TableCellDataEditable
  },

  emits: ['handle-delete', 'handle-edit', 'handle-toggle-edit', 'handle-input-edit'],

  async setup(props, ctx){
  //#region component and props

    // const itemUnderEdit = ref()
    // putting keyComputed here somehow reversed the render order of the cell components
    // const keyComputed = (i) => {
    //   if (!!itemUnderEdit.value) {
    //     if(itemUnderEdit.value.itemId == props.item.itemId) {
    //       return `${i}-edit`
    //     }
    //   }
    //   return i
    // }

    onUpdated(() => {
      colorLog('on updated table row body', 'red', 'yellow')
      // console.log(props.editRefs)
    })
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
    // console.log(props.itemUnderEdit)
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
          editRefs: props.editRefs,
          editableColumns: props.editableColumns,
          itemUnderEdit: props.itemUnderEdit
        }
      }
    }

  //#endregion
    // all controls emit click (i think)
    const handleClick = (e) => {
      console.log(e)
      switch(e.action) {
        case ACTION_DELETE:
          ctx.emit('handle-delete', e.item)
          break
        case ACTION_EDIT:
          if (props.itemUnderEdit) {
            ctx.emit('handle-toggle-edit', null)
          }
          ctx.emit('handle-toggle-edit', e)
          // itemUnderEdit.value = e.item
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
