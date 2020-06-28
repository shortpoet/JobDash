import { createContactStore } from './contact.store'
import { createTaskStore } from './task.store'
import { createMessageStore } from './message.store'
import { inject, provide } from 'vue'
import { Store, StateMap, StoreState, StoreAxios } from './store.interface'
import { IContact } from '../interfaces/contact/contact.interface'
import { ITask } from '../interfaces/task/task.interface'
import { IMessage } from '../interfaces/message/message.interface'
import { IBoard } from '../interfaces/board/board.interface'
import { createBoardStore, BOARD_STORE_SYMBOL } from './board.store'
import { IBoardColumn } from '../interfaces/board/board.column.interface'
import { TableItem } from '../interfaces/table/table.item.interface'
import { createTableStoreLocal } from './table.store'

export const ITEMS_ID_SYMBOL = 'id'
export const CONTACT_ID_SYMBOL = '_id'
export const TASK_ID_SYMBOL = '_id'
export const MESSAGE_ID_SYMBOL = '_id'

const STORE = 'store'

export const ITEMS_COLLECTION_NAME = 'items'

export const TABLE_STORE_LOCAL_SYMBOL = 'tableStoreLocal'

export const CONTACT_STORE_SYMBOL = 'contactStore'
export const TASK_STORE_SYMBOL = 'taskStore'
export const MESSAGE_STORE_SYMBOL = 'messageStore'

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

const store = new Store(ITEMS_ID_SYMBOL, initialStoreState())

store.modules = {}
const tableStoreLocal = createTableStoreLocal(ITEMS_ID_SYMBOL, ITEMS_COLLECTION_NAME)
tableStoreLocal.getState()

const contactStore = createContactStore(CONTACT_ID_SYMBOL)
contactStore.getState()
const taskStore = createTaskStore(TASK_ID_SYMBOL)
taskStore.getState()
const messageStore = createMessageStore(MESSAGE_ID_SYMBOL)
messageStore.getState()
const boardStore = createBoardStore()
boardStore.getState()

store.modules[TABLE_STORE_LOCAL_SYMBOL] = tableStoreLocal
store.modules[CONTACT_STORE_SYMBOL] = contactStore
store.modules[TASK_STORE_SYMBOL] = taskStore
store.modules[MESSAGE_STORE_SYMBOL] = messageStore
store.modules[BOARD_STORE_SYMBOL] = boardStore

export const provideStore = () => {
  provide(STORE, store)
}

export const useStore = (): StoreAxios<IContact|ITask|IMessage|IBoard>|Store<TableItem> => {
  const store = inject<StoreAxios<IContact|ITask|IMessage|IBoard>|Store<TableItem>>(STORE)
  return store
}

// const taskStore = createTaskStore()
// taskStore.getState()
// const messageStore = createMessageStore()
// messageStore.getState()

// const boardStore = createBoardStore()
// boardStore.getState()

// store.modules = {}
// store.modules['taskStore'] = taskStore
// store.modules['messageStore'] = messageStore
// store.modules['boardStore'] = boardStore
