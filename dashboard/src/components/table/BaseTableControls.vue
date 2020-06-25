<template>
  <BaseBox class="base-table-controls-box">
    <BaseSwitchArray
      :options="columnNames"
      :boxed="false"
      :orientation="'horizontal'"
      :type="'columns'"
      :item-type="itemType"
      @chosen-properties="handleChosenColumnChange"
    ></BaseSwitchArray>
    <BaseSwitchArray
      :options="controlNames"
      :boxed="false"
      :orientation="'horizontal'"
      :type="'controls'"
      :item-type="itemType"
      @chosen-properties="handleChosenControlChange"
    ></BaseSwitchArray>
  </BaseBox>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, Ref, onUpdated } from 'vue'
import { ITableConfig, BaseTableConfig, TableConfig, ControlName } from './../../interfaces/table/table.interface'

import BaseSwitchArray from './../common/BaseSwitchArray.vue'
import BaseBox from './../common/BaseBox.vue'

import { colorLog } from '../../utils'

import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'BaseTableControls',

  props: {
    itemType: {
      type: String,
      required: true
    },
    columnNames: {
      type: Array,
      required: false
    },
    controlNames: {
      type: Array,
      required: false
    }
  },

  components: {
    BaseBox,
    BaseSwitchArray,
  },

  emits: [
    'column-change',
    'control-change',
  ],

  setup(props, ctx){
    colorLog('base table', 'green', 'yellow')
    
    onUpdated(() => {
      // colorLog('on updated base table', 'blue', 'yellow')
    })

    //#region header
      //#region dataProperties

        const chosenColumns = ref([
          ...props.columnNames
        ])
        const chosenControls = ref([
          ...props.controlNames
        ])
        
        const handleChosenColumnChange = (e) => {
          colorLog("on chosen COLUMN change", "pink", "blue")
          chosenColumns.value = e.chosenProperties
          ctx.emit('column-change', {columns: chosenColumns.value, itemType: props.itemType})
        }
        const handleChosenControlChange = (e) => {
          colorLog("on chosen CONTROL change", "blue", "pink")
          chosenControls.value = e.chosenProperties
          ctx.emit('control-change', {controls: chosenControls.value, itemType: props.itemType})
        }

        
      //#endregion


      // const controlSwitch = {}
      // const columnSwitch = {}
      // controlNames.forEach(control => {const dict = {}; dict[control] = true; Object.assign(controlSwitch, dict)})
      // columnNames.forEach((column, i) => {const dict = {}; (i > 2 && i < 6) ? dict[column] = true : dict[column] = false; Object.assign(columnSwitch, dict)})
      
    //#endregion

    //#region body
      //#endregion
      

    //#endregion

    return {
      chosenColumns,
      chosenControls,
      handleChosenColumnChange,
      handleChosenControlChange
      // controlSwitch,
      // columnSwitch
    }

  }
})
</script>

