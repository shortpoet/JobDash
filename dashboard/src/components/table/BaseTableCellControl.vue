<template>
  <slot>
    <td class="icon-cell" @click="handleClick(props.item)">
      <BaseIcon :color="props.color" :name="props.controlIcon"></BaseIcon>        
    </td>
  </slot>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import BaseIcon from './../../components/common/BaseIcon.vue'
import { colorLog } from '../../utils'

export default defineComponent({
  name: 'BaseTableCellControl',
  components: {
    BaseIcon
  },
  props: {
    props: {
      type: Object,
      required: true
    },

    // color: {
    //   type: String,
    //   required: true
    // },
    // controlIcon: {
    //   type: String,
    //   required: true
    // },
    // item: {
    //   type: Object,
    //   required: true
    // }
  },
  emits: ['handle-click'],
  async setup(props, ctx){
    // console.log(props)
    const propertyEdit = ref()
    const handleClick = (item) => {
      colorLog('handle click base table cell control', 'orange', 'green')
      ctx.emit('handle-click', {item: props.props.propertyData, action: props.props.action})
    }
    return {
      handleClick,
      propertyEdit
    }

  }
})
</script>

