import { ref, toRefs, Ref, reactive } from "vue"
import { colorLog } from "../../utils"
import { useUpdateValues } from "../useUpdateValues";
import moment from "moment";

export function useInitEdit(editable) {
  colorLog('use init edit', 'blue', 'yellow')
  // console.log(editable)
  const properties = []
  const refArray = []
  // without making this clone of the original array, 
  // the props were being mutated by the operation causing an error on second load
  const editRefs = toRefs(reactive([...editable]))

  const itemTouched = ref(false)

  Object.entries(editRefs).forEach(entry => {
    refArray.push(entry[1])
    properties.push(entry[1].value)
  })
  console.log(properties)
  return {
    properties,
    refArray,
    itemTouched
  }
}