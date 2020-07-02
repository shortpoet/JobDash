import { ref } from "vue"
import { colorLog } from "../../utils"
import { StoreAxios } from "../../store/store.interface"
import { IMessage } from "../../interfaces/message/message.interface"
import { IContact } from "../../interfaces/contact/contact.interface"
import { ITask } from "../../interfaces/task/task.interface"

export function useCreate(store: StoreAxios<IContact|IMessage|ITask>, ctx) {

  // emits: ['update-values']

    const confirmDelete = ref(false)
    const deleteCandidate = ref<Object>(null)
        
    const createItem = async (item, itemType) => {
      // colorLog('delete item from use delete', 'blue', 'green')
      const deletedId = await store.createRecord(item)
      // null check
      ctx.emit('update-values', itemType)
    }
    
  return {
    createItem
  }
}