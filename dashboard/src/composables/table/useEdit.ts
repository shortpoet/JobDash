import { ref, toRefs, Ref } from "vue"
import { colorLog } from "../../utils"
import { useUpdateValues } from "../useUpdateValues";
import moment from "moment";

export function useEdit(store, ctx, editable) {
    //#region edit
    const editRefs = toRefs(editable)
    colorLog('use edit', 'blue', 'yellow')
    console.log(editRefs);
    const refArray = []
    const properties = []
    Object.entries(editRefs).forEach(entry => {
      refArray.push(entry[1])
      properties.push(entry[1].value)
    })
    
    
    //#region updateValues
      const itemTouched = ref(false)
      useUpdateValues(itemTouched, refArray)
    //#endregion

    const toggleEditable = async (oldItem, idSymbol, updateValuesCallback) => {
      colorLog('toggle editable', 'red', 'yellow')
      console.log(oldItem)
      if (oldItem.editable == false) {
        colorLog('editable false', 'red', 'yellow')
        store.toggleEditable(oldItem, true)
        updateValuesCallback()
        refArray.forEach((item, i) => {
          item.value = oldItem[properties[i]]
        })
      } else {
        if (itemTouched.value == true) {
          let newItem = {
            ...oldItem,
            edited: moment(),
            editable: false,
            locked: true
          }
          properties.forEach(prop => {
            const dict = {}
            dict[prop] = oldItem[prop]
            Object.assign(newItem, dict)
          })  
          await store.editRecord(
            oldItem, 
            newItem,
            idSymbol
          )
          itemTouched.value = false
          // this closes the edit window by updating the refs after newTask editable set to false
          ctx.emit('update-tasks')
        } else {
          store.toggleEditable(oldItem, false)
        }
      }
    }

  // #endregion
    return {
      toggleEditable
    }
}