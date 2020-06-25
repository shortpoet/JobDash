<template>
  <table class="table is-hoverable">
    <thead>
      <TableRowHeader
        :columns="columns"
        :data-properties="columnNames"
        :control-types="controlNames"
      />
    </thead>

    <tbody>
      <TableRowBody
        v-for="item in items"
        :key="keyComputed(item)" 
        :class="`${itemType}-row has-text-centered`"
        :item="item"
        :columns="columns"
        :item-type="itemType"
        @handle-delete="handleDelete"
        @handle-input-edit="handleInputEdit"
        @handle-toggle-edit="handleToggleEdit"
        @handle-edit-modal="handleEditModal"
        @handle-toggle-delete="handleToggleDelete"
        @handle-click="handleClick"
        @handle-edit-init="handleEditInit"
        :editable-columns="columnNames"
        :item-under-edit="itemUnderEditComputed(item)"
      />
    </tbody>

  </table>

  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, Ref, onUpdated } from 'vue'
import { ITableConfig, BaseTableConfig, TableConfig, ControlName } from './../../interfaces/table/table.interface'
import BaseSwitchArray from './../common/BaseSwitchArray.vue'
import TableRowHeader from './TableRowHeader.vue'
import TableRowBody from './TableRowBody.vue'
import BaseBox from './../common/BaseBox.vue'
import { colorLog } from '../../utils'
import { IModal, Destination } from '../../interfaces/common/modal.interface'
import { useRouter } from 'vue-router'
import { useModal } from '../../composables/useModal'

export default defineComponent({
  name: 'BaseTable',
  props: {
    chosenPropArray: {
      type: Array
    },

    items: {
      type: Array,
      default: () => []
    },
    idSymbol: {
      type: String,
      required: true
    },
    itemType: {
      type: String,
      required: true
    },
    itemUnderEdit: {
      type: Object,
      required: false
    },
    columns: {
      type: Array
    },
    columnNames: {
      type: Array
    },
    controlNames: {
      type: Array
    }
  },
  components: {
    BaseBox,
    BaseSwitchArray,
    TableRowHeader,
    TableRowBody,
  },
  emits: [
    'handle-delete',
    'handle-confirm-edit',
    'handle-input-edit',
    'handle-toggle-edit',
    'handle-toggle-delete',
    'confirm-delete',
    'update-values',
  ],
  setup(props, ctx){
    colorLog('base table', 'green', 'yellow')
    // console.log(props.columns)
    const deleteItemDestination: Destination = '#delete-item-modal'
    const itemDeleteModal = useModal(deleteItemDestination)
    const editItemDestination: Destination = '#edit-item-modal'
    const itemEditModal = useModal(editItemDestination)

    onUpdated(() => {
      // colorLog('on updated base table', 'blue', 'yellow')
    })

    //#region body
      //#region edit
        const itemUnderEdit = ref()
        const keyComputed = (item) => {
          // colorLog('key computed', 'green', 'yellow')
          // console.log(props.itemUnderEdit)
          // recompute key to only rerender that row
          return !!props.itemUnderEdit
            ? props.itemUnderEdit.itemId == item.itemId
              ? `${item[props.idSymbol]}-edit`
              : item[props.idSymbol]
            : item[props.idSymbol]
          // if (!!itemUnderEdit.value) {
          //   if(itemUnderEdit.value.itemId == item.itemId) {
          //     return `${item[props.idSymbol]}-edit`
          //   }
          // }
          // return item[props.idSymbol]
        }
        const itemUnderEditComputed = (item) => {
          return props.itemUnderEdit
            ? props.itemUnderEdit.itemId == item.itemId
              ? true
              : false
            : false
        }

      //#endregion
      
      //#region modal edit

        const router = useRouter()

        const handleEditModal = (e) => {
          switch(props.itemType) {
            case 'task':
              colorLog('handle edit modal at table row body', 'blue', 'green')
              itemEditModal.showModal()
              const idSymbol = '_id'
              const itemType = props.itemType
              console.log(e.item[idSymbol])
              router.push({
                name: '#edit-item-modal',
                path: `/${itemType}/${e.item[idSymbol]}`,
                params: { id: e.item[idSymbol], item: JSON.stringify(e.item) } 
              })
          }
        }
      //#endregion

    //#endregion
    return {
      keyComputed,
      itemUnderEditComputed,
      itemEditModal,
      itemDeleteModal,
      handleEditModal,
      editItemDestination,
      handleInputEdit: (e) => ctx.emit(
        'handle-input-edit',
        {
          value: e.value,
          propertyName: e.propertyName,
          itemType: props.itemType,
          valueChanged: e.valueChanged
        }
      ),
      handleToggleEdit: (e) => {
        // colorLog('handle toggle edit at table row body', 'blue', 'white')
        // console.log(e)
        ctx.emit('handle-toggle-edit', {item: e.item, itemType: props.itemType, editableColumns: e.editableColumns})
      },
      modalConfirmEdit: (e) => {
        // console.log(e)        
        ctx.emit('handle-confirm-edit', {modal: true, item: e.item, itemType: props.itemType, editableColumns: e.editableColumns})
      },
      handleToggleDelete: (item) => ctx.emit('handle-toggle-delete', {item: item, itemType: props.itemType}),
      handleDelete: (item) => ctx.emit('handle-delete', {item: item, itemType: props.itemType}),
      updateValues: () => ctx.emit('update-values')
    }

  }
})
</script>

