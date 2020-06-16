<template>
  <slot>
    <td class="icon-cell" @click="handleClick(item)">
      <BaseIcon :color="color" :name="controlIcon"></BaseIcon>        
    </td>
  </slot>
  <div />
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import BaseIcon from './../../components/common/BaseIcon.vue'

export default defineComponent({
  name: 'BaseTableCellControl',
  components: {
    BaseIcon
  },
  props: {
    color: {
      type: String,
      required: true
    },
    controlIcon: {
      type: String,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['handle-click'],
  async setup(props, ctx){
    const propertyEdit = ref()
    const handleClick = (item) => {
      ctx.emit('handle-click', item)
    }
    return {
      propertyEdit
    }

  }
})
</script>

