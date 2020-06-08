import { createContactStore, ContactStore } from './contact.store'
import { createTaskStore, TaskStore } from './task.store'
import { inject, provide } from 'vue'
import { Store } from './store.interface'

const contactStore = createContactStore()
contactStore.getState()
const taskStore = createTaskStore()
taskStore.getState()

const store = new Store()
store.modules['contactStore'] = contactStore
store.modules['taskStore'] = taskStore

export const provideStore = () => {
  provide('store', store)
}

export const useStore = (): Store => {
  // instead of returning store directly
  // create new var called store
  // inject this via 'store' string
  // search for closest component that called provideStore with same string 
  // and return that value
  const store = inject<Store>('store')
  return store
}

