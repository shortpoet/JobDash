import { createContactStore } from './contact.store'
import { createTaskStore } from './task.store'
import { createMessageStore } from './message.store'
import { inject, provide } from 'vue'
import { Store, StateMap, StoreState, StoreAxios } from './store.interface'
import { Contact } from '../interfaces/contact/contact.interface'
import { Task } from '../interfaces/task/task.interface'
import { Message } from '../interfaces/message/message.interface'
import { createBoardStore } from './board.store'
import { IBoardColumn } from '../interfaces/board/board.column.interface'

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

const boardStore = createBoardStore()
boardStore.getState()

store.modules = {}
store.modules['contactStore'] = contactStore
store.modules['taskStore'] = taskStore
store.modules['messageStore'] = messageStore
store.modules['boardStore'] = boardStore

export const provideStore = () => {
  provide('store', store)
}

export const useStore = (): StoreAxios<Contact|Task|Message|IBoardColumn> => {
  const store = inject<StoreAxios<Contact|Task|Message|IBoardColumn>>('store')
  return store
}

