import { ref, toRefs, Ref, reactive } from "vue"
import { colorLog } from "../../utils"
import { useUpdateValues } from "../useUpdateValues";
import moment from "moment";

export function useEdit(store, ctx, itemTouched, refArray) {
  colorLog('use edit', 'blue', 'yellow')
  console.log(itemTouched)
  // console.log(editable)
  //   //#region edit
  //   const properties = []
  //   const createEditRefArray = () => {
  //     const editRefs = toRefs(reactive(editable))
  //     // const editRefs = toRefs(editable)
  //     console.log(editRefs);
  //     const refArray = []
  //     Object.entries(editRefs).forEach(entry => {
  //       refArray.push(entry[1])
  //       properties.push(entry[1].value)
  //     })
  //     return refArray
  //   }
    // const refArray = createEditRefArray()
    // //#region updateValues
    //   const itemTouched = ref(false)
    // //#endregion

    const editItem = async (oldItem, properties, idSymbol, itemTouched) => {
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
    }
    console.log('about to use update vals')
    useUpdateValues(itemTouched, refArray)
    
    const toggleEditable = async (oldItem, idSymbol, updateValuesCallback, editableColumns, refArray) => {
      colorLog('toggle editable', 'red', 'yellow')
      console.log(itemTouched)
      if (oldItem.editable == false) {
        colorLog('editable false', 'red', 'yellow')
        store.toggleEditable(oldItem, true)
        let counter = 0
        Object.keys(oldItem).forEach(property => {
          if (editableColumns.includes(property)) {
            refArray[counter].value = oldItem[property]
            counter++
          }
        })
        console.log(itemTouched)
        updateValuesCallback()
      } else {
        if (itemTouched.value == true) {
          colorLog('item is touched', 'blue', 'yellow')
          
          // editItem(oldItem, idSymbol, properties)
        } else {
          colorLog('item NOT touched', 'green', 'yellow')
          console.log(oldItem)
          store.toggleEditable(oldItem, false)
        }
      }
    }

  // #endregion
    return {
      toggleEditable,
      // createEditRefArray
    }
}