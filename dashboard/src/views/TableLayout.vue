<template>
  <section class="section table-section">
    <div class="table-container">
      <div class="table-minimize-container task-table-minimize-container">
        <BaseMinimize
          :class-prop="`${itemType}-table-container`"
          :component-name="`${itemType} Table`"
          @minimize-change="handleMinimize"
          :minimized="false"
        >
          <BaseTableControls
            :item-type="itemType"
            :column-names="columnNames"
            :control-names="controlNames"
            :editable-columns="editableColumnNames"
            @column-change="handleColumnChange"
            @control-change="handleControlChange"
            @editable-change="handleEditableChange"
          >
          </BaseTableControls>
          <BaseBox scrollable>
            <BaseTable
              :items="items"
              :columns="columnsRef"
              :id-symbol="idSymbol"
              :item-type="itemType"
              :column-names="columnNamesRef"
              :control-names="controlNamesRef"
              :editable-columns="editableColumnNames"
              @handle-delete="handleDelete"
              @handle-toggle-delete="handleToggleDelete"
              @handle-toggle-edit="handleToggleEdit"
              @handle-confirm-edit="handleConfirmEdit"
              @handle-input-edit="handleInputEdit"
              @confirm-delete="confirmDelete"
              @handle-edit-modal="handleEditModal"
              :item-under-edit="itemUnderEdit"
            />
          </BaseBox>
        </BaseMinimize>
      </div>
    </div>
  </section>

  <!-- <teleport :to="`#delete-${itemType}-modal`" v-if="itemDeleteModal.visible">
    <ModalWarning @delete-item="confirmDelete" :destination="`#delete-${itemType}-modal`" />
  </teleport> -->

  <teleport :to="`#edit-item-modal`" v-if="itemEditModal.visible && tableHasEditCandidate">
    <BaseItemEditCard
      @modal-confirm-edit="modalConfirmEdit"
      :editable-columns="editableColumnNames"
      :destination="editItemDestination"
    />
  </teleport>

</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, onUpdated, Ref, watch, toRefs } from 'vue'
import BaseMinimize from '../components/common/BaseMinimize.vue'

import BaseBox from './../components/common/BaseBox.vue'
import BaseTable from './../components/table/BaseTable.vue'
import BaseTableControls from './../components/table/BaseTableControls.vue'
import BaseItemEditCard from './../components/common/BaseItemEditCard.vue'
import ModalWarning from './../components/common/ModalWarning.vue'

import { useModal } from '../composables/useModal'

import { ITableColumnData, ITableConfigSettings, ControlName, CONTROL_ID, CONTROL_DELETE, CONTROL_EDIT, CONTROL_LOCKED, CONTROL_MESSAGE, TableConfig } from './../interfaces/table/table.interface'

import { Destination, IModal } from '../interfaces/common/modal.interface'
import { Tab } from '../interfaces/common/tab.interface'

import { useRouter } from 'vue-router'
import { colorLog } from '../utils'
import { useDelete } from '../composables/table/useDelete'
import { useEdit } from '../composables/table/useEdit'

export default defineComponent({
  name: 'TableLayout',
  props: {
    items: {
      type: Array as () => object[],
      required: true
    },
    itemType: {
      type: String,
      required: true
    },
    idSymbol: {
      type: String,
      required: true
    },
    columnNames: {
      type: Array as () => string[],
      required: true
    },
    controlNames: {
      type: Array as () => ControlName[],
      default: () => [CONTROL_ID, CONTROL_DELETE, CONTROL_EDIT, CONTROL_LOCKED, CONTROL_MESSAGE]
    },
    editableColumns: {
      type: Array as () => string[]
    },
    store: {
      type: Object,
      required: false
    },
    deleteConfirm: {
      type: Boolean
    }
  },
  components: {
    BaseMinimize,
    BaseBox,
    BaseTableControls,
    BaseTable,
    ModalWarning,
    BaseItemEditCard
  },
  emits: [
    // TODO
      // ensure naming convention for emits
      // use handle if passing on event
      // otherwise if initiating event start with action verb 
    // #TODO
    'update-values',
    'confirm-delete'
  ],
  setup(props, ctx) {
    colorLog('table layout', 'green', 'yellow')
    // console.log(props.items)
    // init refs at top so config and choice regions have access
    const chosenColumns: Ref<string[]> = ref([...props.columnNames])
    const chosenControls: Ref<ControlName[]> = ref([...props.controlNames])
    const chosenEditable: Ref<string[]> = ref([...props.editableColumns])
    //#region table config
      const tableSettings: ITableConfigSettings = {
        data: chosenColumns.value,
        controls: chosenControls.value,
        editable: chosenEditable.value
      }

      const tableConfig = new TableConfig(tableSettings)

      const { columns, controlNames: controlNamesRef , columnNames: columnNamesRef, editableColumnNames } = tableConfig
      const columnsRef = ref(columns)

      // console.log(columnsRef)    
    //#endregion

    //#region choice
      // columns
      const handleColumnChange = (e) => {
        // colorLog('handle column change', 'green', 'yellow')
        // console.log(e)
        chosenColumns.value = e.columns
      }
      watch(
        () => chosenColumns.value.length, 
        (value: number, previous:number) => {
            // console.log(`Watch controls.value.length function called with args:", \nvalue: ${value}, \nprevious: ${previous}`)
            columnsRef.value = []
            columnsRef.value = new TableConfig({data: chosenColumns.value, controls: chosenControls.value, editable: chosenEditable.value}).columns
        },
        // not sure if i want this called immediately
        // makes update function run on load
        {immediate: true}
      )
      // controls
      const handleControlChange = (e) => {
        // colorLog('handle control change', 'green', 'yellow')
        // console.log(e)
        chosenControls.value = e.controls
      }
      watch(
        () => chosenControls.value.length, 
        (value: number, previous:number) => {
            // console.log(`Watch controls.value.length function called with args:", \nvalue: ${value}, \nprevious: ${previous}`)
            columnsRef.value = []
            columnsRef.value = new TableConfig({data: chosenColumns.value, controls: chosenControls.value, editable: chosenEditable.value}).columns
        },
        // not sure if i want this called immediately
        // makes update function run on load
        {immediate: true}
      )
      // editable
      const handleEditableChange = (e) => {
        // colorLog('handle control change', 'green', 'yellow')
        // console.log(e)
        chosenEditable.value = e.editable
      }
      watch(
        () => chosenEditable.value.length, 
        (value: number, previous:number) => {
            // console.log(`Watch controls.value.length function called with args:", \nvalue: ${value}, \nprevious: ${previous}`)
            columnsRef.value = []
            columnsRef.value = new TableConfig({data: chosenColumns.value, controls: chosenControls.value, editable: chosenEditable.value}).columns
        },
        // not sure if i want this called immediately
        // makes update function run on load
        {immediate: true}
      )
    //#endregion

    //#region modal
      const deleteItemDestination: Destination = '#delete-item-modal'
      const itemDeleteModal = useModal(deleteItemDestination)
      const editItemDestination: Destination = '#edit-item-modal'
      const itemEditModal = useModal(editItemDestination)

    //#endregion


    //#region delete
      const taskIdSymbol = '_id'
      const itemDelete = useDelete(props.store, ctx)

      const handleToggleDelete = async (e) => {
        // colorLog('handle toggle delete at main layout', 'yellow', 'green')
        if (e.item.locked == false) {
          await props.store.toggleDeletable(e.item, true)
          ctx.emit('update-values', props.itemType)
        } else {
          await props.store.toggleDeletable(e.item, false)
          ctx.emit('update-values', props.itemType)
        }
      }
      const tableHasDeleteCandidate = ref(false)
      const handleDelete = (e) => {
        // colorLog('handle delete from table layout', 'magenta', 'yellow')
        tableHasDeleteCandidate.value = itemDelete.handleConfirmDelete(e.item, itemDeleteModal, taskIdSymbol, props.itemType)
      }

      const confirmDelete = () => {
        // colorLog('confirm delete from table layout', 'yellow', 'magenta')
        if (tableHasDeleteCandidate.value == true) {
          itemDelete.deleteItem(itemDeleteModal, taskIdSymbol, props.itemType)
          tableHasDeleteCandidate.value = false
        }
      }
      watch(
        () => props.deleteConfirm,
        (value) => {
          if (value == true) {
            confirmDelete()
          }
        }
        )
    //#endregion
    
    //#region edit
      const itemUnderEdit = ref()
      //#region table edit

        let itemTouched = ref()
        const itemEdit = useEdit(props.store, ctx)

        const handleToggleEdit = (e) => {
          // colorLog('toggle edited item at table layout', 'purple', 'yellow')
          // console.log(e)
          if (!itemUnderEdit.value) {
            // if it is false but being emitted it wants this component to set it to true
            itemUnderEdit.value = e.item          
          } else {
            itemUnderEdit.value = null
            handleConfirmEdit(e)
          }
        }

        const handleInputEdit = (e) => {
          // colorLog('handle input edit at table layout', 'magenta', 'yellow')
          // console.log(e)
          const toggleEditable = itemEdit.toggleEditable
          itemTouched.value = e.valueChanged
          toggleEditable(itemTouched, e.value, e.propertyName)
        }
        const handleConfirmEdit = (e) => {
          // console.log(e)
          // colorLog('confirm edit item at main layout', 'yellow', 'blue')
          // TODO
            // fix side-effect if you click another edit cell to close edit
          // #TODO
          const editItem = itemEdit.editItem
          e.modal
            ? itemTouched.value = true
            : itemTouched.value = itemTouched.value
          editItem(e.item, taskIdSymbol, itemTouched, e.itemType)
        }
      //#endregion
      //#region modal edit

        const tableHasEditCandidate = ref(false)
        const handleEditModal = (e) => {
          colorLog('handle edit modal at table layout', 'blue', 'green')
          console.log(props.itemType)
          console.log(e.itemType)
          if (props.itemType == e.itemType) {
            tableHasEditCandidate.value = true
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


      // const handleEditModal = (e) => {
      //   switch(e.itemType) {
      //     case 'task':
      //       colorLog('handle edit modal at main layout', 'blue', 'green')
      //       itemEditModal.showModal()
      //       const idSymbol = '_id'
      //       const itemType = 'task'
      //       console.log(e.item[idSymbol])
      //       router.push({
      //         name: '#edit-item-modal',
      //         path: `/${itemType}/${e.item[idSymbol]}`,
      //         params: { id: e.item[idSymbol] } 
      //       })
      //   }
      // }

    //#endregion

    //#region future
      const handleMinimize = (e) => {
        // perhaps some kind of logic eventually emerges
        // console.log('handle minimize')
        // console.log(e)
      }
      
      onUpdated(() => {
        // colorLog('on updated table layout', 'green', 'yellow')
        // console.log(props.taskEditRefs)
      })
    
      //#region openCard

        const router = useRouter()
        const openCard = (_id) => {
          itemEditModal.showModal()
          router.push({ name: '#edit-item-modal', params: { id: _id } })
        }
        const cardIsOpen = computed(() => {
          return router.currentRoute.value.name === editItemDestination
        })
      //#endregion
    //#endregion
    console.log(editableColumnNames)
    return {
      tableHasEditCandidate,
      itemDeleteModal,
      itemEditModal,
      itemUnderEdit,
      columnsRef,
      controlNamesRef,
      columnNamesRef,
      editableColumnNames,
      handleMinimize,
      cardIsOpen,
      handleColumnChange,
      handleControlChange,
      handleEditableChange,
      handleToggleEdit,
      handleEditModal,
      // handleConfirmEdit: (e) => ctx.emit('handle-confirm-edit', e),
      handleInputEdit,
      handleToggleDelete,
      handleDelete,
      confirmDelete: (item) => ctx.emit('confirm-delete', item),
    }

  }
})
</script>

<style lang="scss">
</style>
