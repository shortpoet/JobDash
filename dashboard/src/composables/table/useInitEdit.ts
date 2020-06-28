import { ref, toRefs, Ref, reactive } from "vue"
import { colorLog } from "../../utils"
import { useUpdateValues } from "../useUpdateValues";
import moment from "moment";

export function useInitEdit(values) {
  // colorLog('use init edit', 'blue', 'yellow')
  // console.log(editable)
  const refArray = []
  // without making this clone of the original array, 
  // the props were being mutated by the operation causing an error on second load
  const editRefs = toRefs(reactive([...values]))

  const itemTouched = ref(false)

  Object.entries(editRefs).forEach(entry => {
    refArray.push(entry[1])
  })
  return {
    refArray,
    itemTouched
  }
}