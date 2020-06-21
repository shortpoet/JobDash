import { ref, toRefs, Ref, reactive } from "vue"
import { colorLog } from "../../utils"
import { useUpdateValues } from "../useUpdateValues";
import moment from "moment";

export function useEdit(store, ctx) {
  colorLog('use edit', 'blue', 'yellow')
  const _valueChanged = ref()
  let refArray = []

  const editItem = async (oldItem, idSymbol, updateValuesCallback, valueChanged) => {
    colorLog('edit item', 'yellow', 'red')
    console.log(valueChanged.value)
    console.log(refArray)
    if(valueChanged.value == true) {
      let newItem = {
        ...oldItem,
        edited: moment(),
        editable: false,
        locked: true
      }
      refArray.forEach(ref => {
        const key = Object.keys(ref.value)[0]
        newItem[key] = ref.value[key]
      })
      await store.editRecord(
        oldItem, 
        newItem,
        idSymbol
      )
      // this closes the edit window by updating the refs after newTask editable set to false
      updateValuesCallback()
    }
  }
    
  const toggleEditable = async (valueChanged, value, propertyName) => {
    colorLog('toggle editable', 'red', 'yellow')
    console.log(valueChanged.value)
    if (valueChanged.value == true) {
      colorLog('item is touched', 'blue', 'yellow')
      const dict = {}
      dict[propertyName] = value
      const propRef = ref(dict)
      refArray.push(propRef)
      _valueChanged.value = valueChanged.value
    } else {
      colorLog('item NOT touched', 'green', 'yellow')
      refArray = refArray.filter(ref => Object.keys(ref.value) != propertyName)
      _valueChanged.value = valueChanged.value
    }
  }

  return {
    toggleEditable,
    editItem
  }
}