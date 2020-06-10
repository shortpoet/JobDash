import { createContactStore, ContactStore } from './contact.store'
import { createTaskStore, TaskStore } from './task.store'
import { inject, provide } from 'vue'
import { Store, StateMap, StoreState, StoreAxios } from './store.interface'
import { Contact } from '../interfaces/contact.interface'
import { Task } from '../interfaces/task.interface'

const initialStateMap = () : StateMap => ({
  ids: [
  ],
  all: {
  },
  loaded: false
})

const initialStoreState = (): StoreState => ({
  records: initialStateMap()
})

const store = new Store(initialStoreState())
// console.log(store)


const contactStore = createContactStore()
contactStore.getState()
const taskStore = createTaskStore()
taskStore.getState()

store.modules = {}
store.modules['contactStore'] = contactStore
store.modules['taskStore'] = taskStore

// console.log(contactStore)

export const provideStore = () => {
  provide('store', store)
}

export const useStore = (): StoreAxios<Contact|Task> => {
  // instead of returning store directly
  // create new var called store
  // inject this via 'store' string
  // search for closest component that called provideStore with same string 
  // and return that value
  const store = inject<StoreAxios<Contact|Task>>('store')
  return store
}

