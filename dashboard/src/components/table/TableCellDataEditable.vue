<template>
  <td v-if="props.propertyData.editable" contenteditable>
    <BaseInput type="text" :name="props.propertyName" @input="handleInput" v-model="propertyEdit" />
      {{ propertyEdit }}
  </td>
  <td v-else>{{ props.propertyData[props.propertyName] }}</td>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import BaseInput from './../../components/common/BaseInput.vue'
import { colorLog } from '../../utils'

export default defineComponent({
  name: 'TableCellDataEditable',

  components: {
    BaseInput
  },

  props: {
    props: {
      type: Object,
      required: true
    }
    // propertyData: {
    //   type: Object,
    //   required: true
    // },
    // editable: {
    //   type: Boolean,
    //   default: false
    // }
  },

  async setup(props, ctx){
    colorLog('table data edit', 'red', 'yellow')
    const propertyEdit = ref()
    const handleInput = () => {
      ctx.emit('handle-input', propertyEdit.value)
    }
    return {
      propertyEdit,
      handleInput
    }

  }
})
</script>

