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
            @column-change="handleColumnChange"
            @control-change="handleControlChange"
          >
          </BaseTableControls>
          <BaseBox scrollable>
            <BaseTable
              :items="items"
              :columns="columnsRef"
              :id-symbol="idSymbol"
              :item-type="itemType"
              @handle-delete="handleDelete"
              @handle-toggle-delete="handleToggleDelete"
              @handle-toggle-edit="handleToggleEdit"
              @handle-confirm-edit="handleConfirmEdit"
              @handle-input-edit="handleInputEdit"
              @confirm-delete="confirmDelete"
              :item-under-edit="itemUnderEdit"
              :column-names="columnNamesRef"
              :control-names="controlNamesRef"
            />
          </BaseBox>
        </BaseMinimize>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, onUpdated, Ref, watch, toRefs } from 'vue'
import BaseMinimize from '../components/common/BaseMinimize.vue'

import BaseBox from './../components/common/BaseBox.vue'
import BaseTable from './../components/table/BaseTable.vue'
import BaseTableControls from './../components/table/BaseTableControls.vue'

import { useModal } from '../composables/useModal'

import { ITableColumnData, ITableConfigSettings, ControlName, CONTROL_ID, CONTROL_DELETE, CONTROL_EDIT, CONTROL_LOCKED, CONTROL_MESSAGE, TableConfig } from './../interfaces/table/table.interface'

import { Destination, IModal } from '../interfaces/common/modal.interface'
import { Tab } from '../interfaces/common/tab.interface'

import { useRouter } from 'vue-router'
import { colorLog } from '../utils'

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
    itemUnderEdit: {
      type: Object,
      required: false
    },
  },
  components: {
    BaseMinimize,
    BaseBox,
    BaseTableControls,
    BaseTable,
  },
  emits: [
    // TODO
      // ensure naming convention for emits
      // use handle if passing on event
      // otherwise if initiating event start with action verb 
    // #TODO
    'update-values',
    'update-messages',
    'handle-delete',
    'handle-toggle-delete',
    'handle-toggle-edit',
    'handle-input-edit',
    'handle-confirm-edit',
    'confirm-delete',
    'handle-edit-init',
    'handle-column-change',
    'handle-control-change',
  ],
  setup(props, ctx) {
    colorLog('table layout', 'green', 'yellow')
    // console.log(props.items)

    const chosenColumns: Ref<string[]> = ref([...props.columnNames])
    const chosenControls: Ref<ControlName[]> = ref([...props.controlNames])
    const handleColumnChange = (e) => {
      colorLog('handle column change', 'green', 'yellow')
      console.log(e)
      chosenColumns.value = e.columns
    }
    const tableSettings: ITableConfigSettings = {
      data: chosenColumns.value,
      controls: chosenControls.value
    }

    const tableConfig = new TableConfig(tableSettings)

    const { columns, controlNames: controlNamesRef , columnNames: columnNamesRef } = tableConfig
    const columnsRef = ref(columns)

    console.log(columnsRef)

    watch(
      () => chosenColumns.value.length, 
      (value: number, previous:number) => {
          // console.log(`Watch controls.value.length function called with args:", \nvalue: ${value}, \nprevious: ${previous}`)
          columnsRef.value = []
          columnsRef.value = new TableConfig({data: chosenColumns.value, controls: chosenControls.value}).columns
      },
      // not sure if i want this called immediately
      // makes update function run on load
      {immediate: true}
    )
    const handleControlChange = (e) => {
      colorLog('handle control change', 'green', 'yellow')
      console.log(e)
      chosenControls.value = e.controls
    }
    watch(
      () => chosenControls.value.length, 
      (value: number, previous:number) => {
          // console.log(`Watch controls.value.length function called with args:", \nvalue: ${value}, \nprevious: ${previous}`)
          columnsRef.value = []
          columnsRef.value = new TableConfig({data: chosenColumns.value, controls: chosenControls.value}).columns
      },
      // not sure if i want this called immediately
      // makes update function run on load
      {immediate: true}
    )

    const handleMinimize = (e) => {
      console.log('handle minimize')
      console.log(e)
    }
    
    onUpdated(() => {
      // colorLog('on updated table layout', 'green', 'yellow')
      // console.log(props.taskEditRefs)
    })


    //#region openCard
      const editItemDestination: Destination = '#edit-item-modal'
      const itemEditModal = useModal(editItemDestination)

      const router = useRouter()
      const openCard = (_id) => {
        itemEditModal.showModal()
        router.push({ name: '#edit-item-modal', params: { id: _id } })
      }
      const cardIsOpen = computed(() => {
        return router.currentRoute.value.name === editItemDestination
      })
    //#endregion


    return {
      columnsRef,
      controlNamesRef,
      columnNamesRef,
      handleMinimize,
      cardIsOpen,
      handleColumnChange,
      handleControlChange,
      handleToggleEdit: (e) => ctx.emit('handle-toggle-edit', e),
      handleConfirmEdit: (e) => ctx.emit('handle-confirm-edit', e),
      handleInputEdit: (e) => ctx.emit('handle-input-edit', e),
      handleToggleDelete: (e) => ctx.emit('handle-toggle-delete', e),
      handleDelete: (item) => ctx.emit('handle-delete', item),
      confirmDelete: (item) => ctx.emit('confirm-delete', item),
    }

  }
})
</script>

<style lang="scss">
</style>
