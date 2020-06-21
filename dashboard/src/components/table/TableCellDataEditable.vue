<template>
  <td v-if="props.itemUnderEdit" >
    <BaseInput v-if="propertyEdit != ''" type="text" :name="props.propertyName" @input="handleInput" v-model="propertyEdit" />
      {{ propertyEdit }}
  </td>
  <td v-else>{{ props.propertyData[props.propertyName] }}</td>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, onUpdated } from 'vue'
import BaseInput from './../../components/common/BaseInput.vue'
import { colorLog } from '../../utils'
import { useInitEdit } from '../../composables/table/useInitEdit'
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
    // editable: {
    //   type: Boolean,
    //   default: false
    // }
  },
  emits: ['handle-input-edit'],

  async setup(props, ctx){
    colorLog('table data edit', 'red', 'yellow')
    // console.log(props)
    const propertyEdit = ref(props.props.propertyData[props.props.propertyName])
    const isItemUnderEdit = !!props.props.itemUnderEdit
    // const isItemUnderEdit = hasItemUnderEdit ? props.props.itemUnderEdit.itemId == props.props.propertyData.itemId : false
    if (isItemUnderEdit) {
      console.log(isItemUnderEdit)
      const editableColumns = props.props.editableColumns
      const { refArray, itemTouched } = useInitEdit(props.props.editableColumns)
      const index = props.props.editableColumns.indexOf(props.props.propertyName)
      // init ref data 
      refArray[index].value = props.props.propertyData[props.props.propertyName]
      const propertyEdit = refArray[index]
    }
    // ctx.emit('handle-click', {item: props.props.propertyData, action: props.props.action, refArray: refArray, itemTouched: itemTouched.value, editableColumns: props.props.editableColumns})

    onUpdated(() => {
      if (isItemUnderEdit) {
        colorLog('on updated table cell editable', 'green', 'red')
        console.log(isItemUnderEdit)
        console.log(props.props.propertyData.itemId)
      }
    })



    const handleInput = () => {
      const itemEdit = props.props.propertyData
      // below throws warning that set error on readonly
      // itemEdit[props.props.propertyName] = propertyEdit.value
      // console.log({item: itemEdit})
      // ctx.emit('handle-input', {item: itemEdit})
      ctx.emit('handle-input-edit', {value: propertyEdit.value, propertyName: props.props.propertyName})
    }
    return {
      propertyEdit,
      handleInput
    }

  }
})
</script>

