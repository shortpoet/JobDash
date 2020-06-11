import { watch, Ref } from "vue"


export const useUpdateValues = (touched: Ref<boolean>, fields: Ref<string>[]) => {

  const updateField = (value: string, previous: string) => {
    if (previous) {
      touched.value = true
    }
  }
  fields.forEach(field => {
    watch(
      () => field.value,
      (value: string, previous: string) => updateField(value, previous)
    )
  });
}