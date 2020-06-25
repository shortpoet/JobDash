import { reactive, readonly, provide, inject } from "vue"
import axios from "axios"
import { StateMap, Store, StoreState, IStore, StoreAxios } from "./store.interface"
import { useStorage } from "../composables/useStorage"
import { IBoardItem } from "../interfaces/board/board.item.interface"

// using 'category' here (logically, in hindsight) only returned the first item for each category
type IdSymbol = 'itemId'
const ID_SYMBOL: IdSymbol = 'itemId'
type StoreSymbol = 'boardStore'
const BOARD_STORE: StoreSymbol = 'boardStore'

interface BoardStateMap extends StateMap {
  ids: string[]
  all: Record<string, IBoardItem>
  loaded: boolean
}

interface BoardStoreState extends StoreState{
  records: BoardStateMap,
  // boards: StateMap
}

const initialBoardsStateMap = () : BoardStateMap => ({
  ids: [
  ],
  all: {
  },
  loaded: false
})

const initialBoardStoreState = () : BoardStoreState => ({
  records: initialBoardsStateMap(),
  // boards: initialBoardsStateMap()
})


export class BoardStore extends StoreAxios<IBoardItem> implements IStore<IBoardItem> {
  protected state: BoardStoreState
  constructor(idSymbol: string, initialState: BoardStoreState) {
    super(idSymbol, initialState)
    // this.state['boards'] = this.state.records
    // this.state = reactive(initialState)
  }

  public getState(): BoardStoreState {
    return readonly<BoardStoreState>(this.state)
  }

  public getLastId(): IBoardItem[IdSymbol] {
    const last = this.getLast<IBoardItem>()
    return last ? last.itemId : '-1'
  }

  public getRecordsByCategory(category: string): IBoardItem[] {
    console.log('get by category')
    // console.log(category)
    // console.log(this.state.records)
    // console.log(this.state.records.all)
    return Object.entries(this.state.records.all).reduce<IBoardItem[]>((accumulator, record) => {
      if (record[1].category == category) {
        return accumulator.concat(record[1])  
      }
      return accumulator
    }, [])
  }

  async createRecord(board: IBoardItem) {
    super.createRecord(board)
    // const response = await axios.post<BoardDTO>('http://localhost:3000/board/create', board)
  }

  async deleteRecord(board: IBoardItem) {
    super.deleteRecord(board)
    // const response = await axios.delete<BoardDTO>(`http://localhost:3000/board/delete?board_id=${board._id}`)
    // return response.data.board._id
  }

  
  async editRecord(oldItem: IBoardItem, newItem: IBoardItem) {
    // console.log(oldItem.columnOrder)
    // console.log(newItem.columnOrder)
    super.editRecord(oldItem, newItem)
    // console.log('writing to db')

    // const response = await axios.put<BoardDTO>(
    //   `http://localhost:3000/board/update?board_id=${oldBoard._id}`,
    //   newBoard
    // )
  }
  async fetchRecords(data?) {
    // get is generic so can specify type
    // const data = await this._fetchRecords('http://localhost:3000/contact/contacts')

    // console.log('fetch records at board store')
    // console.log(data)
    this.addRecords(data)
    this.state.records.loaded = true
  }

}

const boardStore = new BoardStore(ID_SYMBOL, initialBoardStoreState())
boardStore.getState()

export const provideBoardStore = () =>  {
  provide(BOARD_STORE, boardStore)
}


export const createBoardStore = () => {
  const boardStore = new BoardStore(ID_SYMBOL, initialBoardStoreState())
  boardStore.getState()
  return boardStore
}

export const useBoardStore = (): BoardStore => {
  // instead of returning store directly
  // create new var called store
  // inject this via 'store' string
  // search for closest component that called provideStore with same string 
  // and return that value
  const boardStore = inject<BoardStore>(BOARD_STORE)
  return boardStore
}

export interface IBoardStore {
  boardStore: BoardStore
}
