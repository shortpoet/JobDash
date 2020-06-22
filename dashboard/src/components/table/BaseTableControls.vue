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
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, Ref, onUpdated } from 'vue'
import { ITableConfig, BaseTableConfig, ID, DELETE, EDIT, LOCKED, MESSAGE, TableConfig, ControlName } from './../../interfaces/table/table.interface'

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
  ],

  async setup(props, ctx){
    colorLog('base table', 'green', 'yellow')
    
    onUpdated(() => {
      // colorLog('on updated base table', 'blue', 'yellow')
    })

    //#region header
      //#region dataProperties

        const chosenProperties = ref([
          ...props.columnNames
        ])
        
        const handleChosenColumnChange = (e) => {
          // colorLog("on chosen column change", "pink", "blue")
          chosenProperties.value = e.chosenProperties
        }

        
        const chosenPropArray = computed (() => chosenProperties.value)

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
      chosenPropArray
      // controlSwitch,
      // columnSwitch
    }

  }
})
</script>

