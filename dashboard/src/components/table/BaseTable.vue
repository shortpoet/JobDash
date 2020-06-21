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
        @handle-delete="handleDelete"
        @handle-edit="handleEdit"
        @handle-input-edit="handleInputEdit"
        @handle-toggle-edit="handleToggleEdit"
        @handle-click="handleClick"
        :editable-columns="editableColumnsComputed"
        :item-under-edit="itemUnderEditComputed(item)"
      />
    </tbody>

  </table>

  <teleport :to="`#delete-item-modal`" v-if="deleteModal.visible">
    <ModalWarning @delete-item="confirmDelete" :destination="'#delete-item-modal'" />
  </teleport>

  <!-- <teleport :to="`#edit-${itemType}-modal`" v-if="contactCardModal.visible">
    <router-view/>
    <ContactCard @update-contacts="updateContacts" :destination="'#contact-card-modal'"/>
  </teleport> -->

  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, Ref, onUpdated } from 'vue'
import { ITableConfig, BaseTableConfig, ID, DELETE, EDIT, LOCKED, MESSAGE, TableConfig, ControlName } from './../../interfaces/table/table.interface'
import BaseSwitchArray from './../common/BaseSwitchArray.vue'
import ModalWarning from './../common/ModalWarning.vue'
import TableRowHeader from './TableRowHeader.vue'
import TableRowBody from './TableRowBody.vue'
import BaseBox from './../common/BaseBox.vue'
import { colorLog } from '../../utils'
import { IModal } from '../../interfaces/common/modal.interface'

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
    editRefs: {
      type: Array,
      required: false
    }
  },

  components: {
    BaseBox,
    BaseSwitchArray,
    TableRowHeader,
    TableRowBody,
    ModalWarning
  },

  emits: ['update-values', 'handle-delete', 'handle-edit', 'handle-toggle-edit', 'handle-input-edit', 'confirm-delete'],

  async setup(props, ctx){
    colorLog('base table', 'green', 'yellow')
    // console.log(props.editRefs);
    const itemUnderEdit = ref()
    // const keyComputed = computed((item) => {
    //   console.log(item)
    //   if (!!itemUnderEdit.value) {
    //     if(itemUnderEdit.value.itemId == item.itemId) {
    //       return `${item[props.idSymbol]}-edit`
    //     }
    //   }
    //   return item[props.idSymbol]
    // })
    const keyComputed = (item) => {
      if (!!itemUnderEdit.value) {
        if(itemUnderEdit.value.itemId == item.itemId) {
          return `${item[props.idSymbol]}-edit`
        }
      }
      return item[props.idSymbol]
    }
    const itemUnderEditComputed = (item) => {
      return itemUnderEdit.value
        ? itemUnderEdit.value.itemId == item.itemId
          ? true
          : false
        : false
    }
    
    onUpdated(() => {
      colorLog('on updated base table', 'blue', 'yellow')
      // console.log(props.editRefs)
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

    //#endregion
    // const getEditRefs = (item) => {
    //   if (itemUnderEdit.value) {
    //     if (item.itemId == itemUnderEdit.value.itemId) {
    //       return props.editRefs
    //     }
    //   } else {
    //     return []
    //   }
    // } 
    return {
      keyComputed,
      itemUnderEdit,
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
      handleEdit: (item) => ctx.emit(
        'handle-edit',
        {
          item: item,
          propertyName: item.propertyName,
          itemType: props.itemType,
          editable: editableColumns(dataProperties.value)
        }
      ),
      handleInputEdit: (e) => ctx.emit(
        'handle-input-edit',
        {
          value: e.value,
          propertyName: e.propertyName,
          itemType: props.itemType
        }
      ),
      // handleEdit: (item) => ctx.emit('handle-edit', {value: item.value, propertyName: item.propertyName, itemType: props.itemType}),
      handleToggleEdit: (e) => {
        return e
          ? itemUnderEdit.value = e.item
          : itemUnderEdit.value = null
        // ctx.emit(
        //   'handle-toggle-edit',
        //   {
        //     item: e.item,
        //     itemType: props.itemType
        //     // editable: editableColumns(dataProperties.value),
        //     // itemTouched: e.itemTouched,
        //     // refArray: e.refArray,
        //     // editableColumns: e.editableColumns
        //   }
        // )
      },
      handleDelete: (item) => ctx.emit('handle-delete', {item: item, itemType: props.itemType}),
      confirmDelete: (item) => ctx.emit('confirm-delete', {item: item, itemType: props.itemType}),
      editableColumnsComputed

    }

  }
})
</script>

