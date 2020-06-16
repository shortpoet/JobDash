<template>
  <tr>
    <BaseTableCellData
      v-for="item in items"
      :key="item.id">
    />
    <BaseTableCellControl
      v-for="item in items"
      :key="item.id">
    />

  <tr/>
</template>

<script lang="ts">
import moment from 'moment'
import { defineComponent, computed, ref, watch, onMounted } from 'vue'

export default defineComponent({
  name: 'TableRowBody',

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
  },

  emits: ['update-contacts'],

  async setup(props, ctx){
    
    return {
    }

  }
})
</script>

<style lang="scss">
</style>
