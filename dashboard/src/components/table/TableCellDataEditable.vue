<template>
  <td v-if="props.propertyData.editable" contenteditable>
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
    

    // const propertyEdit = ref(props.props.propertyData[props.props.propertyName])
    const index = props.props.editableColumns.indexOf(props.props.propertyName)
    // console.log(index)
    // console.log(props.props.editRefs)
    let propertyEdit = ref(props.props.editRefs[index] ? props.props.editRefs[index].value : '')
    // console.log(propertyEdit)
    onUpdated(() => {
      colorLog('on updated table cell editable', 'green', 'yellow')
      console.log(props.props.editRefs)
      const index = props.props.editableColumns.indexOf(props.props.propertyName)
      console.log(index)
      const _propertyEdit = props.props.editRefs[index]
      propertyEdit.value = _propertyEdit.value
      console.log(propertyEdit.value)
    })

    // const editableColumns = props.props.editableColumns
    // const { refArray, itemTouched } = useInitEdit(props.props.editableColumns)

    // console.log('about to use update vals')
    // useUpdateValues(itemTouched, refArray)

    // const checkRefs = async (oldItem, idSymbol, updateValuesCallback, properties) => {
    // const checkRefs = async () => {
    //   colorLog('toggle editable', 'red', 'yellow')
    //   console.log(refArray)

    //   console.log(oldItem)
    //   if (oldItem.editable == false) {
    //     colorLog('editable false', 'red', 'yellow')
    //     // store.toggleEditable(oldItem, true)
    //     updateValuesCallback()
    //     // this sets the ref value to the current value otherwise defaults to category/column name
    //     refArray.forEach((item, i) => {
    //       item.value = oldItem[properties[i]]
    //     })
    //   } else {
    //     if (itemTouched.value == true) {
    //       colorLog('item is touched', 'blue', 'yellow')
          
    //       // editItem(oldItem, idSymbol, properties)
    //     } else {
    //       colorLog('item NOT touched', 'green', 'yellow')
    //       console.log(oldItem)
    //       // store.toggleEditable(oldItem, false)
    //     }
    //   }
    // }





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

