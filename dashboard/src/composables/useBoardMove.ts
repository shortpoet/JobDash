import { IBoardColumn } from "../interfaces/board/board.column.interface"
import { IBoardItem } from "../interfaces/board/board.item.interface"
import { BoardStore } from "../store/board.store"

export default function useBoardMove(boardStore: BoardStore, ctx) {
  // console.log('use board move')
  
  const moveItemOrColumn = (e: DragEvent, toColumnCategory: string, toItemOrder: number) => {
    // console.log('move item or column - item column')
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
    e.dataTransfer.setData('type', 'item')
  }
  
  const moveItem = (e: DragEvent, toColumnCategory: string, toItemOrder: number) => {
    // console.log('move item')
    const fromItemItemId = e.dataTransfer.getData('from-item-itemId')
    // console.log(toColumnCategory)
    const toItems = boardStore.getRecordsByCategory(toColumnCategory)
    // console.log(toItems)
    const toColumnOrder = toItems[0].columnOrder

    // when dropping on empty column to item order will be undefined because there is no to item affected by event
    if (!toItemOrder) {
      // when not adding exactly to end of array it doesn't work
      toItemOrder = toItems.length
    }

    const oldItem: IBoardItem = boardStore.getRecordById(fromItemItemId)
    const newItem = {...oldItem, category: toColumnCategory, itemOrder: toItemOrder, columnOrder: toColumnOrder}

    boardStore.editRecord(oldItem, newItem)
    // TODO
    // emit update-items to update category

    ctx.emit('board-move')
  }
  const pickupColumn = (e: DragEvent, fromColumn: IBoardColumn) => {
    // console.log('pickup columns')
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

    ctx.emit('board-move')
  }


  return {
    pickupColumn,
    pickupItem,
    moveItemOrColumn
  }
}


