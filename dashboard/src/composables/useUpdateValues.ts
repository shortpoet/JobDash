import { watch, Ref } from "vue"
import { colorLog } from "../utils"


export const useUpdateValues = (touched: Ref<boolean>, fields: Ref<string>[]) => {
  colorLog('use update values', 'yellow', 'blue')
  // console.log(touched.value)

  const updateField = (value: string, previous: string) => {
    if (previous) {
      // console.log(previous)
      touched.value = true
      // console.log(touched.value)
    }
  }
  fields.forEach(field => {
    // console.log(field.value)
    watch(
      () => field.value,
      (value: string, previous: string) => updateField(value, previous)
    )
  });
}