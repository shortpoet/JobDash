import { ref } from "vue"
import { colorLog } from "../../utils"

export function useDelete(modal, destination, store, idSymbol, ctx) {

  // emits: ['update-values']

  //#region delete
    const confirmDelete = ref(false)
    const deleteCandidate = ref<Object>(null)
    

    // const modal = useModal()
    // this didn't properly return a reactive ref
    // const modalMap = useModalMap()
    // const destination = '#delete-task-modal'
    // modalMap.addModal(destination)
    // const modal = modalMap.modalMap[destination]
  

    const handleConfirmDelete = (item, modal, idSymbol, updateValuesCallback) => {
      colorLog('handle confirm delete from use delete', 'blue', 'green')
      console.log(item)
      if (item.locked) {
        deleteCandidate.value = item
        modal.showModal()
      } else {
        deleteCandidate.value = item
        deleteItem(modal, idSymbol, updateValuesCallback)
      }
    }
    
    const deleteItem = async (modal, idSymbol, updateValuesCallback) => {
      colorLog('delete item from use delete', 'blue', 'green')
      console.log(idSymbol)
      modal.hideModal()
      const deletedId = await store.deleteRecord(deleteCandidate.value)
      // null check
      deleteCandidate.value[idSymbol] == deletedId ? deleteCandidate.value = null : ''
      updateValuesCallback()
    }
    
    const toggleDeletable = async (item) => {
      // console.log('use delete toggle deletable')
      // console.log(item.locked)
      if (item.locked == false) {
        await store.toggleDeletable(item, true)
        ctx.emit('update-values')
        // console.log(item.locked)
      } else {
        await store.toggleDeletable(item, false)
        ctx.emit('update-values')
        // console.log(item.locked)
      }
    }
  //#endregion

  return {
    handleConfirmDelete,
    deleteItem
  }
}