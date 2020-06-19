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
      <tr
        v-for="item in items"
        :key="item[idSymbol]" 
        :class="`${itemType}-row has-text-centered`"
      >
        <td>{{item.itemId}}</td>
        <td>{{item.name}}</td>
      </tr>
    </tbody>

  </table>

  <!-- <teleport :to="`#delete-${itemType}-modal`" v-if="deleteContactModal.visible">
    <ModalWarning @delete-item="deleteContact" :destination="'#delete-contact-modal'"/>
  </teleport>

  <teleport :to="`#edit-${itemType}-modal`" v-if="contactCardModal.visible">
    <router-view/>
    <ContactCard @update-contacts="updateContacts" :destination="'#contact-card-modal'"/>
  </teleport> -->

  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, Ref } from 'vue'
import { ITableConfig, BaseTableConfig, ID, DELETE, EDIT, LOCKED, MESSAGE, TableConfig, ControlName } from './../../interfaces/table/table.column.interface'
import BaseSwitchArray from './../common/BaseSwitchArray.vue'
import TableRowHeader from './TableRowHeader.vue'
import BaseBox from './../common/BaseBox.vue'
import { colorLog } from '../../utils'

export default defineComponent({
  name: 'BaseTable',

  props: {
    items: {
      type: Array,
      required: true
    },
    idSymbol: {
      type: String,
      required: true
    },
    itemType: {
      type: String,
      required: true
    }
  },

  components: {
    BaseBox,
    BaseSwitchArray,
    TableRowHeader
  },

  emits: ['update-values'],

  async setup(props, ctx){

    //#region header
      //#region dataProperties
        const columnNames = [
          ...Object.keys(props.items[0]),
        ]

        const chosenProperties = ref([
          ...columnNames.slice(2,6)
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
                editable: [...dataProperties.filter(prop => prop.toLowerCase().match(/id$/))]
              })
            } else {
              return new TableConfig({
                columns: [
                  ...dataProperties,
                  ...controls
                ],
                editable: [...dataProperties.filter(prop => prop.toLowerCase().match(/id$/))]
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
              editable: [...dataProperties.filter(prop => prop.toLowerCase().match(/id$/))]
            })
          }
        }
        const configRef = ref<ITableConfig>()
        configRef.value = configComputed(dataProperties.value)
      //#endregion
    //#endregion

    //#region body

    //#endregion
    return {
      dataProperties,
      columnNames,
      controlNames,
      controlTypes,
      configRef,
      handleChosenColumnChange,
      handleChosenControlChange,
      // controlSwitch,
      // columnSwitch
    }

  }
})
</script>

