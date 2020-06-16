<template>
  <BaseTableCellData>
    <td v-if="editable" contenteditable>
      <BaseInput type="text" :name="propertyData.propertyName" @input="handleInput" v-model="propertyEdit" />
        {{ propertyEdit }}
    </td>
    <td v-else>{{ propertyData.data }}</td>
  </BaseTableCellData>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import BaseInput from './../../components/common/BaseInput.vue'

export default defineComponent({
  name: 'TableCellDataEditable',

  components: {
    BaseInput
  },

  props: {
    propertyData: {
      type: Object,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    }
  },

  async setup(props, ctx){
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

