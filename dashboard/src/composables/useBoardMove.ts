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


export default function useBoardMove(boardStore: BoardStore) {
  console.log('use board move')
  
  const onUpdateBoard = async () => {
    console.log('use board - update') 
    // const newBoard = await updateBoard(items, board)
  }

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
  const moveItemOrColumn = (e: DragEvent, toColumnItems: IBoardItem[], toColumnOrder: number, toItemOrder: number) => {
    console.log('move item or column - item column')
    const type = e.dataTransfer.getData('type')
    console.log(type)
    // console.log(e)
    // console.log(toColumnItems)
    // console.log(toColumnOrder)
    // console.log(toItemOrder)
  
    if (type === 'item') {
      // moveItem(e, toItems, toItemIndex !== undefined ? toItemIndex : toItems.length)
    } else {
      moveColumn(e, toColumnOrder)
    }
  }
  const moveColumn = (e: DragEvent, toColumnOrder: number) => {
    const fromColumnCategory = e.dataTransfer.getData('from-column-category')
    const fromColumnIndex = e.dataTransfer.getData('from-column-index')
    const fromColumnId = e.dataTransfer.getData('from-column-id')
    console.log(toColumnOrder)
    console.log(e.dataTransfer.getData('from-column-category'))
    console.log(e.dataTransfer.getData('from-column-id'))
    console.log(e.dataTransfer.getData('from-column-order'))
    // boardStore.editRecord
    
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
  

  return {
    onUpdateBoard,
    pickupColumn,
    pickupItem,
    moveItemOrColumn
  }
}


