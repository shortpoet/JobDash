<template>
  <tr>
    <TableCellHeaderData
      v-for="prop in dataProperties" 
      :key="prop"
      :property-name="prop.propertyName"
    />
    <TableCellHeaderControl
      v-for="control in controlTypes" 
      :key="control"
      :control-name="control.controlName"
    />
  </tr>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import TableCellHeaderData from './TableCellHeaderData.vue'
import TableCellHeaderControl from './TableCellHeaderControl.vue'

export default defineComponent({
  name: 'TableRowHeader',

  props: {
    dataProperties: {
      type: Array,
      required: true
    },
    controlTypes: {
      type: Array,
      required: true
    }
  },

  components: {
    TableCellHeaderData,
    TableCellHeaderControl,
  },


  async setup(props, ctx){
    

    return {
    }

  }
})
</script>

