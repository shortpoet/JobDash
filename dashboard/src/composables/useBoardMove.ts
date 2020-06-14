import { IBoardColumn } from "../interfaces/board/board.column.interface"
import { IBoardItem } from "../interfaces/board/board.item.interface"
import { IBoard } from "../interfaces/board/board.interface"
import { useStorage } from './useStorage'
import { BoardStore } from "../store/board.store"
import { ref } from "vue"
import { loadRecords } from '../utils'
import { IBoardable } from "../interfaces/board/boardable.interface"

const storage = useStorage()
const BOARD = 'board'

const pickupColumn = (e: DragEvent, fromColumn: IBoardColumn) => {
  console.log('pickup columns')
  // console.log(fromColumn)
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.dropEffect = 'move'
  
  e.dataTransfer.setData('type', 'column')
  e.dataTransfer.setData('from-column-category', fromColumn.category)
  e.dataTransfer.setData('from-column-id', fromColumn.order.toString())
  e.dataTransfer.setData('from-column-order', fromColumn.order.toString())
  // console.log(e.dataTransfer.getData('from-column-category'))
  // console.log(e.dataTransfer.getData('from-column-id'))
  // console.log(e.dataTransfer.getData('from-column-order'))
}
const moveItemOrColumn = (e: DragEvent, toColumn: IBoardColumn, toColumnIndex: number, toItemIndex: number) => {
  console.log('move item or column - item column')
  const type = e.dataTransfer.getData('type')
  console.log(type)
  console.log(e)
  console.log(toColumn)
  console.log(toColumnIndex)
  console.log(toItemIndex)

  if (type === 'item') {
    // moveItem(e, toItems, toItemIndex !== undefined ? toItemIndex : toItems.length)
  } else {
    moveColumn(e, toColumn)
  }
}
const pickupItem = (e, itemIndex, fromColumnIndex) => {
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.dropEffect = 'move'

  e.dataTransfer.setData('from-item-index', itemIndex)
  e.dataTransfer.setData('from-column-index', fromColumnIndex)
  e.dataTransfer.setData('type', 'item')
}

const moveItem = (e: DragEvent, toColumn: IBoardColumn, toItemIndex: number) => {
  const fromColumnIndex = e.dataTransfer.getData('from-column-index')
  const fromColumnId = e.dataTransfer.getData('from-column-id')
  const fromColumnOrder = e.dataTransfer.getData('from-column-order')
  // const fromItems = columns[fromColumnIndex].items
  const fromItemIndex = e.dataTransfer.getData('from-item-index')

  // this.$store.commit('MOVE_TASK', {
  //   fromItems,
  //   fromItemIndex,
  //   toItems,
  //   toItemIndex
  // })
}
const moveColumn = (e: DragEvent, toColumn: IBoardColumn) => {
  const fromColumnCategory = e.dataTransfer.getData('from-column-category')
  const fromColumnIndex = e.dataTransfer.getData('from-column-index')
  const fromColumnId = e.dataTransfer.getData('from-column-id')
  // const fromColumnOrder = e.dataTransfer.getData('from-column-order')

  console.log(fromColumnCategory)
  // const fromColumn: IBoardColumn = boardStore.getRecordById(fromColumnCategory)
  // let fromColumnCopy: IBoardColumn = {...fromColumn}
  // // save the value of the old column's order to set toColumn
  // const fromColumnOrder = fromColumn.order
  // // set the new value for fromColumn
  // fromColumnCopy.order = toColumn.order
  // boardStore.editRecord(fromColumn, fromColumnCopy, 'category')

  // let toColumnCopy: IBoardColumn = {...toColumn}
  // toColumnCopy.order = fromColumnOrder
  // boardStore.editRecord(toColumn, toColumnCopy, 'category')

  // let orderMap = storage.get('board')
  // // let fromColumnIndex = orderMap[fromColumnCategory]
  // // console.log(orderMap)
  // console.log('from column index', fromColumnIndex)
  // orderMap[fromColumnCategory] = toColumn.order
  // console.log(orderMap)
  // orderMap[toColumn.category] = fromColumnIndex
  // console.log(orderMap)
  // storage.set('board', orderMap)
  
  // this.$store.commit('MOVE_COLUMN', {
  //   fromColumnIndex,
  //   toColumnIndex
  // })

}

export default function useBoardMove(boardStore: BoardStore) {
  console.log('use board move')
  
  const onUpdateBoard = async () => {
    console.log('use board - update') 
    // const newBoard = await updateBoard(items, board)
  }

  return {
    onUpdateBoard,
    pickupColumn,
    pickupItem,
    moveItemOrColumn
  }
}


