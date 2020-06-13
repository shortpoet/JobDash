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
  constructor(initialState: BoardStoreState) {
    super(initialState)
    // this.state['boards'] = this.state.records
    // this.state = reactive(initialState)
  }

  public getState(): BoardStoreState {
    return readonly<BoardStoreState>(this.state)
  }

  public getLastId(): IBoardItem[IdSymbol] {
    const last = this.getLast<IBoardItem>()
    return last ? last.itemId : -1
  }

  async createRecord(board: IBoardItem) {
    super.createRecord(board, ID_SYMBOL)
    // const response = await axios.post<BoardDTO>('http://localhost:3000/board/create', board)
  }

  async deleteRecord(board: IBoardItem) {
    super.deleteRecord(board, ID_SYMBOL)
    // const response = await axios.delete<BoardDTO>(`http://localhost:3000/board/delete?board_id=${board._id}`)
    // return response.data.board._id
  }

  
  async editRecord(oldBoard: IBoardItem, newBoard: IBoardItem, idSymbol: (string | number)) {
    super.editRecord(oldBoard, newBoard, ID_SYMBOL)
    // console.log('writing to db')

    // const response = await axios.put<BoardDTO>(
    //   `http://localhost:3000/board/update?board_id=${oldBoard._id}`,
    //   newBoard
    // )
  }
  async fetchRecords(data?) {
    // get is generic so can specify type
    // const data = await this._fetchRecords('http://localhost:3000/contact/contacts')

    console.log('fetch records')
    this.addRecords(data, ID_SYMBOL)
    this.state.records.loaded = true
  }

}

const boardStore = new BoardStore(initialBoardStoreState())
boardStore.getState()

export const provideBoardStore = () =>  {
  provide(BOARD_STORE, boardStore)
}


export const createBoardStore = () => {
  const boardStore = new BoardStore(initialBoardStoreState())
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
