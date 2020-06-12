import { reactive, readonly, provide, inject } from "vue"
import axios from "axios"
import { StateMap, Store, StoreState, IStore, StoreAxios } from "./store.interface"
import { useStorage } from "../composables/useStorage"
import { ITaskColumn } from "../interfaces/task.column.interface"

interface ColumnStateMap extends StateMap {
  ids: string[]
  all: Record<string, ITaskColumn>
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


export class ColumnStore extends StoreAxios<ITaskColumn> implements IStore<ITaskColumn> {
  protected state: ColumnStoreState
  constructor(initialState: ColumnStoreState) {
    super(initialState)
    // this.state['columns'] = this.state.records
    // this.state = reactive(initialState)
  }

  public getLastId(): ITaskColumn['order'] {
    const last = this.getLast<ITaskColumn>()
    return last ? last.order : -1
  }

  async createRecord(column: ITaskColumn) {
    super.createRecord(column, 'order')
    // const response = await axios.post<ColumnDTO>('http://localhost:3000/column/create', column)
  }

  async deleteRecord(column: ITaskColumn) {
    super.deleteRecord(column, 'order')
    // const response = await axios.delete<ColumnDTO>(`http://localhost:3000/column/delete?column_id=${column._id}`)
    // return response.data.column._id
  }

  
  async editRecord(oldColumn: ITaskColumn, newColumn: ITaskColumn, idSymbol: (string | number)) {
    super.editRecord(oldColumn, newColumn, 'order')
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
