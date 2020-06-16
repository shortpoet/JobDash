<template>
  <BaseTableCellControl>
    <td class="icon-cell" v-if="locked" @click="handleClick(item)">
      <BaseIcon color="gold" name="lock"></BaseIcon>
    </td>

    <td class="icon-cell" v-else @click="handleClick(item)">
      <BaseIcon color="silver" name="unlock"></BaseIcon>
    </td>
  </BaseTableCellControl>
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
    propertyData: {
      type: Object,
      required: true
    },
    locked: {
      type: Boolean,
      default: false
    }
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

