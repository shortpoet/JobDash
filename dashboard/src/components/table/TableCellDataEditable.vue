<template>
  <td v-if="props.itemUnderEdit" >
    <BaseInput v-if="propertyEdit != ''" type="text" :name="props.propertyName" @input="handleInput" v-model="propertyEdit" />
      {{ propertyEdit }}
  </td>
  <td v-else>{{ props.propertyData[props.propertyName] }}</td>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, onUpdated, nextTick } from 'vue'
import BaseInput from './../../components/common/BaseInput.vue'
import { colorLog } from '../../utils'
import { useUpdateValues } from '../../composables/useUpdateValues'

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
    // propertyName: {
    //   type: String,
    //   required: true
    // },
    // itemUnderEdit: {
    //   type: Boolean,
    //   default: false
    // }
  },
  emits: ['handle-input-edit'],
  setup(props, ctx){
    
    // colorLog('table data edit', 'red', 'yellow')
    const initialValue = ref(props.props.propertyData[props.props.propertyName])

    const propertyEdit = ref(props.props.propertyData[props.props.propertyName])

    const valueChanged = ref(initialValue.value != propertyEdit.value)

    const isItemUnderEdit = !!props.props.itemUnderEdit

    onUpdated(() => {
      if (isItemUnderEdit) {
        // colorLog('on updated table cell editable', 'green', 'red')
        valueChanged.value = propertyEdit.value != initialValue.value
      }
    })

    const handleInput = async () => {
      const itemEdit = props.props.propertyData
      // below throws warning that set error on readonly
      // itemEdit[props.props.propertyName] = propertyEdit.value
      // console.log({item: itemEdit})
      // ctx.emit('handle-input', {item: itemEdit})
      // need to wait for updated hook to run before emitting
      await nextTick()
      ctx.emit('handle-input-edit', {value: propertyEdit.value, propertyName: props.props.propertyName, valueChanged: valueChanged.value})
    }
    return {
      propertyEdit,
      handleInput,
    }

  }
})
</script>

