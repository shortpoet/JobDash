import { reactive, readonly, provide, inject } from "vue"
import axios from "axios"
import { StateMap, Store, StoreState, IStore, StoreAxios } from "./store.interface"
import { useStorage } from "../composables/useStorage"
import { IBoardItem } from "../interfaces/board/board.item.interface"

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

  public getLastId(): IBoardItem['id'] {
    const last = this.getLast<IBoardItem>()
    return last ? last.id : -1
  }

  async createRecord(board: IBoardItem) {
    super.createRecord(board, 'id')
    // const response = await axios.post<BoardDTO>('http://localhost:3000/board/create', board)
  }

  async deleteRecord(board: IBoardItem) {
    super.deleteRecord(board, 'id')
    // const response = await axios.delete<BoardDTO>(`http://localhost:3000/board/delete?board_id=${board._id}`)
    // return response.data.board._id
  }

  
  async editRecord(oldBoard: IBoardItem, newBoard: IBoardItem, idSymbol: (string | number)) {
    super.editRecord(oldBoard, newBoard, 'id')
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
    this.addRecords(data, '_id')
    this.state.records.loaded = true
  }

}

const boardStore = new BoardStore(initialBoardStoreState())
boardStore.getState()

export const provideBoardStore = () =>  {
  provide('boardStore', boardStore)
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
  const boardStore = inject<BoardStore>('boardStore')
  return boardStore
}

export interface IBoardStore {
  boardStore: BoardStore
}
