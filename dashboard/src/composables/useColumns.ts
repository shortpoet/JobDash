import { ITaskColumn } from "../interfaces/task.column.interface"
import { ColumnStore } from "../store/column.store"
import { Store } from "../store/store.interface"

export const loadRecords = (store: Store<ColumnStore> , columns: ITaskColumn[], caller: string): ITaskColumn[] => {
  console.log(`load records for ${caller}`)
  if (!store.getState().records.loaded) {
    console.log(columns)
    store.addRecords(columns, 'order')
  }
  return store.getState().records.ids.reduce<any[]>((accumulator, id) => {
    const record = store.getState().records.all[id]
    return accumulator.concat(record)
  }, [])
}

export const updateRecords =  (store: Store<ColumnStore>, caller: string): ITaskColumn[] => {
  console.log(`update records for ${caller}`)
  return store.getState().records.ids.reduce<ITaskColumn[]>((accumulator, id) => {
    const record = store.getState().records.all[id]
    return accumulator.concat(record)
  }, [])
}

export default async function useColumns(store, columns) {
  console.log('use board')

  columns = await loadRecords(store, columns, 'columns')

  const onUpdateColumns = async () => {
    console.log('use board - update') 
    const newValue = await updateRecords(store, 'columns')
    columns.value = newValue
  }

  // const onUpdateBoards = async () => {
  //   allBoardsRef.value = await updateRecords(boardStore, 'boards')
  // }

  return {
    columns,
    onUpdateColumns
  }
}
