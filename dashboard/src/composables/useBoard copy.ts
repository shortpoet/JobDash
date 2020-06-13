import { IBoardColumn } from "../interfaces/board/board.column.interface"
import { BoardStore } from "../store/board.store"
import { Store } from "../store/store.interface"

export const loadRecords = (store: Store<BoardStore> , columns: IBoardColumn[], caller: string): IBoardColumn[] => {
  console.log(`load records for ${caller}`)
  if (!store.getState().records.loaded) {
    // console.log(columns)
    store.addRecords(columns, 'category')
  }
  return store.getState().records.ids.reduce<any[]>((accumulator, id) => {
    const record = store.getState().records.all[id]
    return accumulator.concat(record)
  }, [])
}

export const updateRecords =  (store: Store<BoardStore>, caller: string): IBoardColumn[] => {
  console.log(`update records for ${caller}`)
  return store.getState().records.ids.reduce<IBoardColumn[]>((accumulator, id) => {
    const record = store.getState().records.all[id]
    return accumulator.concat(record)
  }, [])
}

export default async function useBoard(store, columns) {
  console.log('use board')

  columns = await loadRecords(store, columns, 'columns')

  const onUpdateBoard = async () => {
    console.log('use board - update') 
    const newValue = await updateRecords(store, 'columns')
    columns.value = newValue
  }

  // const onUpdateBoards = async () => {
  //   allBoardsRef.value = await updateRecords(boardStore, 'boards')
  // }

  return {
    columns,
    onUpdateBoard
  }
}
