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
import { useInitEdit } from '../../composables/table/useInitEdit'

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
      if (props.props.action == 'edit') {
      colorLog('handle click is EDIT', 'purple', 'silver')
        const editableColumns = props.props.editableColumns
        const { refArray, itemTouched } = useInitEdit(props.props.editableColumns)
        ctx.emit('handle-click', {item: props.props.propertyData, action: props.props.action, refArray: refArray, itemTouched: itemTouched.value, editableColumns: props.props.editableColumns})

      } else {
        ctx.emit('handle-click', {item: props.props.propertyData, action: props.props.action})
      }
    }
    return {
      handleClick,
      propertyEdit
    }

  }
})
</script>

