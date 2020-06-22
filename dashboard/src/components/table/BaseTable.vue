<template>
  <BaseBox class="base-table-controls-box">
    <BaseSwitchArray
      :options="columnNames"
      :boxed="false"
      :orientation="'horizontal'"
      :type="'columns'"
      @chosen-properties="handleChosenColumnChange"
    />
    <BaseSwitchArray
      :options="controlNames"
      :boxed="false"
      :orientation="'horizontal'"
      :type="'controls'"
      @chosen-properties="handleChosenControlChange"
    />
  </BaseBox>
  <table class="table is-hoverable">
    <thead>
      <TableRowHeader
        :columns="configRef.columns"
        :data-properties="dataProperties"
        :control-types="controlTypes"
      />
    </thead>

    <tbody>
      <TableRowBody
        v-for="item in items"
        :key="keyComputed(item)" 
        :class="`${itemType}-row has-text-centered`"
        :item="item"
        :columns="configRef.columns"
        :item-type="itemType"
        @handle-delete="handleDelete"
        @handle-input-edit="handleInputEdit"
        @handle-toggle-edit="handleToggleEdit"
        @handle-edit-modal="handleEditModal"
        @handle-toggle-delete="handleToggleDelete"
        @handle-click="handleClick"
        @handle-edit-init="handleEditInit"
        :editable-columns="editableColumnsComputed"
        :item-under-edit="itemUnderEditComputed(item)"
      />
    </tbody>

  </table>

  <teleport :to="`#delete-item-modal`" v-if="deleteModal.visible">
    <ModalWarning @delete-item="confirmDelete" :destination="'#delete-item-modal'" />
  </teleport>

  <teleport :to="`#edit-item-modal`" v-if="itemEditModal.visible">
    <!-- <router-view/> -->
    <BaseItemEditCard
      @update-values="updateValues"
      :editable-columns="editableColumnsComputed"
      :item-type="itemType"
      :item="item"
    />
  </teleport>

  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, Ref, onUpdated } from 'vue'
import { ITableConfig, BaseTableConfig, ID, DELETE, EDIT, LOCKED, MESSAGE, TableConfig, ControlName } from './../../interfaces/table/table.interface'
import BaseSwitchArray from './../common/BaseSwitchArray.vue'
import BaseItemEditCard from './../common/BaseItemEditCard.vue'
import ModalWarning from './../common/ModalWarning.vue'
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
    deleteModal: {
      type: Object as () => IModal
    },
    editModal: {
      type: Object as () => IModal
    },
    itemUnderEdit: {
      type: Object,
      required: false
    }
  },

  components: {
    BaseBox,
    BaseSwitchArray,
    TableRowHeader,
    TableRowBody,
    ModalWarning,
    BaseItemEditCard
  },

  emits: [
    'handle-delete',
    // 'handle-edit-modal',
    'handle-input-edit',
    'handle-toggle-edit',
    'handle-toggle-delete',
    'confirm-delete',
    'update-values'
  ],

  async setup(props, ctx){
    colorLog('base table', 'green', 'yellow')
    
    onUpdated(() => {
      // colorLog('on updated base table', 'blue', 'yellow')
    })

    //#region header
      //#region dataProperties
        const columnNames = [
          ...Object.keys(props.items[0]),
        ]

        const chosenProperties = ref([
          ...columnNames.slice(2,5)
        ])
        
        const handleChosenColumnChange = (e) => {
          // colorLog("on chosen column change", "pink", "blue")
          chosenProperties.value = e.chosenProperties
        }

        
        const chosenPropArray = computed (() => chosenProperties.value)

        const dataProperties = computed((() => Object.keys(props.items[0]).filter(prop => chosenPropArray.value.includes(prop))))
        // need watch because of class instantiation
        watch(
          () => dataProperties.value.length, 
          (value: number, previous:number) => {
              // console.log(`Watch dataProperties.value.length function called with args:", \nvalue: ${value}, \nprevious: ${previous}`)
              configRef.value = configComputed(dataProperties.value)
          },
          // not sure if i want this called immediately
          // makes update function run on load
          {immediate: false}
        )
      //#endregion

      //#region control
        const controlTypes =  [
          { displayName: ID, action: 'open-link' },
          { displayName: DELETE, action: 'delete' },
          { displayName: EDIT, action: 'edit' },
          { displayName: LOCKED, action: 'toggle-delete' },
          { displayName: MESSAGE, action: 'send-message' },
        ]

        const controlNames: ControlName[] = [
          ID,
          DELETE,
          EDIT,
          LOCKED,
          MESSAGE
        ]

        const chosenControls = ref([
          ...controlNames
        ])
        const handleChosenControlChange = (e) => {
          // colorLog("on chosen control change", "orange", "purple")
          chosenControls.value = e.chosenProperties
        }

        const controls: Ref<ControlName[]> = computed((() => {
          // colorLog('controls computed', 'purple', 'orange')
          const names: ControlName[] = [] as ControlName[]
          controlNames.forEach(control => {
            if(chosenControls.value.includes(control)) {
              let controlName: ControlName
              switch(control) {
                case 'Id':
                  controlName = ID
                  break
                case 'Delete':
                  controlName = DELETE
                  break
                case 'Edit':
                  controlName = EDIT
                  break
                case 'Locked':
                  controlName = LOCKED
                  break
                case 'Message':
                  controlName = MESSAGE
                  break
              }
              names.push(controlName)
            }
          })
          return names
        }))
        watch(
          () => controls.value.length, 
          (value: number, previous:number) => {
              // console.log(`Watch controls.value.length function called with args:", \nvalue: ${value}, \nprevious: ${previous}`)
              configRef.value = configComputed(dataProperties.value, controls.value)
          },
          // not sure if i want this called immediately
          // makes update function run on load
          {immediate: false}
        )
      //#endregion

      // const controlSwitch = {}
      // const columnSwitch = {}
      // controlNames.forEach(control => {const dict = {}; dict[control] = true; Object.assign(controlSwitch, dict)})
      // columnNames.forEach((column, i) => {const dict = {}; (i > 2 && i < 6) ? dict[column] = true : dict[column] = false; Object.assign(columnSwitch, dict)})
      
      //#region config
        const editableColumnsComputed = computed(() => [...dataProperties.value.map(prop => prop.toLowerCase().match(/id$/) ? false : prop)])
        const editableColumns = (dataProperties) => [...dataProperties.map(prop => prop.toLowerCase().match(/id$/) ? false : prop)]
        const configComputed = (dataProperties, controls?: ControlName[]) => {
          // colorLog('config computed', 'yellow', 'green')
          if (controls) {
            // colorLog('has controls', 'yellow', 'blue')
            if (controls.includes(ID)) {
              return new TableConfig({
                columns: [
                  ...controls.slice(0, 1),
                  ...dataProperties,
                  ...controls.slice(1),
                ],
                editable: [...dataProperties.map(prop => prop.toLowerCase().match(/id$/) ? false : true)]
              })
            } else {
              return new TableConfig({
                columns: [
                  ...dataProperties,
                  ...controls
                ],
                editable: [...dataProperties.map(prop => prop.toLowerCase().match(/id$/) ? false : true)]
              })
            }
          } else {
            return new TableConfig({
              columns: [
                ID,
                ...dataProperties,
                DELETE,
                EDIT,
                LOCKED,
                MESSAGE
              ],
              editable: [...dataProperties.map(prop => prop.toLowerCase().match(/id$/) ? false : true)]
            })
          }
        }
        const configRef = ref<ITableConfig>()
        configRef.value = configComputed(dataProperties.value)
      //#endregion
    //#endregion

    //#region body
      //#region edit
        const itemUnderEdit = ref()
        const keyComputed = (item) => {
          // colorLog('key computed', 'green', 'yellow')
          // console.log(props.itemUnderEdit)
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
        const editItemDestination: Destination = '#edit-item-modal'
        const itemEditModal = useModal(editItemDestination)

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
                params: { id: e.item[idSymbol] } 
              })
          }
        }
      //#endregion

    //#endregion

    return {
      keyComputed,
      itemUnderEditComputed,
      dataProperties,
      columnNames,
      controlNames,
      controlTypes,
      configRef,
      handleChosenColumnChange,
      handleChosenControlChange,
      // controlSwitch,
      // columnSwitch
      itemEditModal,
      handleEditModal,
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
        // console.log(e)
        ctx.emit('handle-toggle-edit', {item: e.item, itemType: props.itemType, editableColumns: e.editableColumns})
      },
      // handleEditModal: (e) => {
      //   // console.log(e)
        
      //   // ctx.emit('handle-edit-modal', {item: e.item, itemType: props.itemType, editableColumns: e.editableColumns})
      // },
      handleToggleDelete: (item) => ctx.emit('handle-toggle-delete', {item: item, itemType: props.itemType}),
      handleDelete: (item) => ctx.emit('handle-delete', {item: item, itemType: props.itemType}),
      confirmDelete: (item) => ctx.emit('confirm-delete', {item: item, itemType: props.itemType}),
      editableColumnsComputed,
      updateValues: () => ctx.emit('update-values')
    }

  }
})
</script>

