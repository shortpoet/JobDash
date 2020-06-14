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

  const moveItemOrColumn = (e: DragEvent, toColumnCategory: string, toItemOrder: number) => {
    console.log('move item or column - item column')
    console.log(toItemOrder)
    const type = e.dataTransfer.getData('type')  
    if (type === 'item') {
      moveItem(e, toColumnCategory, toItemOrder)
    } else {
      moveColumn(e, toColumnCategory)
    }
  }
  
  const pickupItem = (e: DragEvent, item: IBoardItem) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.dropEffect = 'move'
  
    e.dataTransfer.setData('from-item-itemId', item.itemId.toString())
    e.dataTransfer.setData('from-item-order', item.itemOrder.toString())
    e.dataTransfer.setData('from-column-order', item.columnOrder.toString())
    e.dataTransfer.setData('from-column-category', item.columnOrder.toString())
    e.dataTransfer.setData('type', 'item')
  }
  
  const moveItem = (e: DragEvent, toColumnCategory: string, toItemOrder: number) => {
    console.log('move item')
    // const fromColumnOrder = parseInt(e.dataTransfer.getData('from-column-order'))
    const fromColumnCategory = e.dataTransfer.getData('from-column-category')
    // const fromItemOrder = e.dataTransfer.getData('from-item-order')
    const fromItemItemId = e.dataTransfer.getData('from-item-itemId')
    // const fromItems = boardStore.getRecordsByCategory(fromColumnCategory)

    const toItems = boardStore.getRecordsByCategory(toColumnCategory)
    const toColumnOrder = toItems[0].columnOrder

    console.log(toItemOrder)

    // when dropping on empty column to item order will be undefined because there is no to item affected by event
    if (!toItemOrder) {
      toItemOrder = toItems.length
    }


    const oldItem: IBoardItem = boardStore.getRecordById(fromItemItemId)
    const newItem = {...oldItem, category: toColumnCategory, itemOrder: toItemOrder, columnOrder: toColumnOrder}
    console.log(newItem);
    
    boardStore.editRecord(oldItem, newItem)
    ctx.emit('update-board')

  }
  const pickupColumn = (e: DragEvent, fromColumn: IBoardColumn) => {
    console.log('pickup columns')
    // console.log(fromColumn)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.dropEffect = 'move'
    
    e.dataTransfer.setData('type', 'column')
    e.dataTransfer.setData('from-column-category', fromColumn.category)
    e.dataTransfer.setData('from-column-order', fromColumn.columnOrder.toString())
  }

  const moveColumn = (e: DragEvent, toColumnCategory: string) => {
    const fromColumnCategory = e.dataTransfer.getData('from-column-category')
    const fromColumnOrder = e.dataTransfer.getData('from-column-order')
    const fromItems = boardStore.getRecordsByCategory(fromColumnCategory)
    const toItems = boardStore.getRecordsByCategory(toColumnCategory)
    const toColumnOrder = toItems[0].columnOrder

    fromItems.forEach(item => {
      const oldItem = item
      const newItem = {...item, columnOrder: toColumnOrder}
      boardStore.editRecord(oldItem, newItem)
    })
    toItems.forEach(item => {
      const oldItem = item
      const newItem = {...item, columnOrder: parseInt(fromColumnOrder)}
      boardStore.editRecord(oldItem, newItem)
    })
    ctx.emit('update-board')
  }


  return {
    onUpdateBoard,
    pickupColumn,
    pickupItem,
    moveItemOrColumn
  }
}


