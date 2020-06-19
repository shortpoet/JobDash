<template>
  <td class="icon-cell" v-if="props.propertyData.locked" @click="handleClick(props.propertyData)">
    <BaseIcon color="gold" name="lock"></BaseIcon>
  </td>

  <td class="icon-cell" v-else @click="handleClick(props.propertyData)">
    <BaseIcon color="silver" name="unlock"></BaseIcon>
  </td>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import BaseTableCellControl from './BaseTableCellControl.vue'
import BaseIcon from './../../components/common/BaseIcon.vue'

export default defineComponent({
  name: 'TableCellControlDelete',
  components: {
    BaseTableCellControl,
    BaseIcon
  },

  props: {
    props: {
      type: Object,
      required: true
    },

    // propertyData: {
    //   type: Object,
    //   required: true
    // },
    // locked: {
    //   type: Boolean,
    //   default: false
    // }
  },
  emits: ['handle-click'],
  async setup(props, ctx){
    const propertyEdit = ref()
    const handleClick = (item) => {
      ctx.emit('handle-click', item)
    }
    return {
      handleClick
    }

  }
})
</script>

