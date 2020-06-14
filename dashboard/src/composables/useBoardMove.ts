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


export default function useBoardMove(boardStore: BoardStore, ctx) {
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
    e.dataTransfer.setData('from-column-id', fromColumn.columnOrder.toString())
    e.dataTransfer.setData('from-column-order', fromColumn.columnOrder.toString())
    // console.log(e.dataTransfer.getData('from-column-category'))
    // console.log(e.dataTransfer.getData('from-column-id'))
    // console.log(e.dataTransfer.getData('from-column-order'))
  }
  const moveItemOrColumn = (e: DragEvent, toColumnItems: IBoardItem[], toColumn: IBoardColumn, toItemOrder: number) => {
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
      moveColumn(e, toColumn)
    }
  }
  const moveColumn = (e: DragEvent, toColumn: IBoardColumn) => {
    const fromColumnCategory = e.dataTransfer.getData('from-column-category')
    const fromColumnOrder = e.dataTransfer.getData('from-column-order')
    const fromColumnId = e.dataTransfer.getData('from-column-id')
    // console.log(toColumn)
    // console.log(e.dataTransfer.getData('from-column-category'))
    // console.log(e.dataTransfer.getData('from-column-id'))
    // console.log(e.dataTransfer.getData('from-column-order'))
    const fromItems = boardStore.getRecordsByCategory(fromColumnCategory)
    const toItems = boardStore.getRecordsByCategory(toColumn.category)
    // console.log(fromItems.map(item => item.columnOrder))
    // console.log(toItems.map(item => item.columnOrder))
    fromItems.forEach(item => {
      const oldItem = item
      // let newItem = {...item}
      // newItem.columnOrder = toColumn.columnOrder
      const newItem = {...item, columnOrder: toColumn.columnOrder}
      boardStore.editRecord(oldItem, newItem)
    })
    toItems.forEach(item => {
      const oldItem = item
      // let newItem = {...item}
      // newItem.columnOrder = parseInt(fromColumnOrder)
      const newItem = {...item, columnOrder: parseInt(fromColumnOrder)}
      boardStore.editRecord(oldItem, newItem)
    })
    const newFromItems = boardStore.getRecordsByCategory(fromColumnCategory)
    const newToItems = boardStore.getRecordsByCategory(toColumn.category)

    // console.log(newFromItems.map(item => item.columnOrder))
    // console.log(newToItems.map(item => item.columnOrder))
    console.log('move columns - update board')
    console.log(ctx);
    
    ctx.emit('update-board', {test: 'test'})

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


