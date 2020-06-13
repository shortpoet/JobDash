import { reactive, readonly, provide, inject } from "vue"
import axios from "axios"
import { StateMap, Store, StoreState, IStore, StoreAxios } from "./store.interface"
import { useStorage } from "../composables/useStorage"
import { IBoardColumn } from "../interfaces/board.column.interface"

interface ColumnStateMap extends StateMap {
  ids: string[]
  all: Record<string, IBoardColumn>
  loaded: boolean
}

interface ColumnStoreState extends StoreState{
  records: ColumnStateMap,
  // columns: StateMap
}

const initialColumnsStateMap = () : ColumnStateMap => ({
  ids: [
  ],
  all: {
  },
  loaded: false
})

const initialColumnStoreState = () : ColumnStoreState => ({
  records: initialColumnsStateMap(),
  // columns: initialColumnsStateMap()
})


export class ColumnStore extends StoreAxios<IBoardColumn> implements IStore<IBoardColumn> {
  protected state: ColumnStoreState
  constructor(initialState: ColumnStoreState) {
    super(initialState)
    // this.state['columns'] = this.state.records
    // this.state = reactive(initialState)
  }

  public getState(): ColumnStoreState {
    return readonly<ColumnStoreState>(this.state)
  }

  public getLastId(): IBoardColumn['category'] {
    const last = this.getLast<IBoardColumn>()
    return last ? last.category : '-1'
  }

  async createRecord(column: IBoardColumn) {
    super.createRecord(column, 'category')
    // const response = await axios.post<ColumnDTO>('http://localhost:3000/column/create', column)
  }

  async deleteRecord(column: IBoardColumn) {
    super.deleteRecord(column, 'category')
    // const response = await axios.delete<ColumnDTO>(`http://localhost:3000/column/delete?column_id=${column._id}`)
    // return response.data.column._id
  }

  
  async editRecord(oldColumn: IBoardColumn, newColumn: IBoardColumn, idSymbol: (string | number)) {
    super.editRecord(oldColumn, newColumn, 'category')
    // console.log('writing to db')

    // const response = await axios.put<ColumnDTO>(
    //   `http://localhost:3000/column/update?column_id=${oldColumn._id}`,
    //   newColumn
    // )
  }

}

const columnStore = new ColumnStore(initialColumnStoreState())
columnStore.getState()

export const provideColumnStore = () =>  {
  provide('columnStore', columnStore)
}


export const createColumnStore = () => {
  const columnStore = new ColumnStore(initialColumnStoreState())
  columnStore.getState()
  return columnStore
}

export const useColumnStore = (): ColumnStore => {
  // instead of returning store directly
  // create new var called store
  // inject this via 'store' string
  // search for closest component that called provideStore with same string 
  // and return that value
  const columnStore = inject<ColumnStore>('columnStore')
  return columnStore
}

export interface IColumnStore {
  columnStore: ColumnStore
}
