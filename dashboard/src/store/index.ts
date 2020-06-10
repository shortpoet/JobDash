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

const contactStore = createContactStore()
contactStore.getState()
const taskStore = createTaskStore()
taskStore.getState()

store.modules = {}
store.modules['contactStore'] = contactStore
store.modules['taskStore'] = taskStore

export const provideStore = () => {
  provide('store', store)
}

export const useStore = (): StoreAxios<Contact|Task> => {
  const store = inject<StoreAxios<Contact|Task>>('store')
  return store
}

