import { createContactStore } from './contact.store'
import { createTaskStore } from './task.store'
import { createMessageStore } from './message.store'
import { inject, provide } from 'vue'
import { Store, StateMap, StoreState, StoreAxios } from './store.interface'
import { Contact } from '../interfaces/contact.interface'
import { Task } from '../interfaces/task.interface'
import { Message } from '../interfaces/message.interface'
import { createColumnStore } from './column.store'
import { ITaskColumn } from '../interfaces/task.column.interface'

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
const messageStore = createMessageStore()
messageStore.getState()

const columnStore = createColumnStore()
columnStore.getState()

store.modules = {}
store.modules['contactStore'] = contactStore
store.modules['taskStore'] = taskStore
store.modules['messageStore'] = messageStore
store.modules['columnStore'] = columnStore

export const provideStore = () => {
  provide('store', store)
}

export const useStore = (): StoreAxios<Contact|Task|Message|ITaskColumn> => {
  const store = inject<StoreAxios<Contact|Task|Message|ITaskColumn>>('store')
  return store
}

