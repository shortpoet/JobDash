import { IBoardColumn } from "./../../interfaces/board/board.column.interface"
import { IBoardItem } from "./../../interfaces/board/board.item.interface"
import { BoardStore } from "./../../store/board.store"
import { colorLog } from "./../../utils"

export default function useBoardMove(boardStore: BoardStore, ctx) {
  // console.log('use board move')
  
  const moveItemOrColumn = (e: DragEvent, toColumn: IBoardColumn, toItem: IBoardItem) => {
    // console.log('move item or column - item column')
    const type = e.dataTransfer.getData('type')  
    if (type === 'item') {
      moveItem(e, toColumn, toItem)
    } else {
      moveColumn(e, toColumn)
    }
  }
  
  const pickupItem = (e: DragEvent, item: IBoardItem) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.dropEffect = 'move'
  
    e.dataTransfer.setData('from-item-itemId', item.itemId.toString())
    e.dataTransfer.setData('from-item-category', item.category)
    e.dataTransfer.setData('from-item-order', item.itemOrder.toString())
    e.dataTransfer.setData('type', 'item')
  }
  
  const moveItem = (e: DragEvent, toColumn: IBoardColumn, toItem: IBoardItem) => {
    // colorLog('move item', 'silver', 'purple')
    const fromItemItemId = e.dataTransfer.getData('from-item-itemId')
    const fromItemCategory = e.dataTransfer.getData('from-item-category')
    const fromItemOrder = parseInt(e.dataTransfer.getData('from-item-order'))
    const toItems = boardStore.getRecordsByCategory(toColumn.category)
    const toColumnOrder = toItems[0].columnOrder
    let toItemOrder
    let oldToItem: IBoardItem
    let newToItem: IBoardItem
    let oldFromItem: IBoardItem
    let newFromItem: IBoardItem
    // when dropping on empty column 
    // or one where there is only one item 
    // to item order will be undefined 
    // because there is no to item affected by event
    // when not adding exactly to end of array it doesn't work the same
    if (!!toItem) {
      // colorLog('has toItem', 'white', 'green')
      toItemOrder = toItem.itemOrder
      oldToItem = toItem
      newToItem = {...oldToItem, itemOrder: (toItem.itemOrder + 1)}
      oldFromItem = boardStore.getRecordById(fromItemItemId)
      newFromItem = {...oldFromItem, category: toColumn.category, itemOrder: toItemOrder, columnOrder: toColumnOrder}
      boardStore.editRecord(oldFromItem, newFromItem)
      boardStore.editRecord(oldToItem, newToItem)
    }
    else if (!toItem) {
      // colorLog('should be column drop', 'green', 'yellow')
      if (fromItemCategory == toColumn.category) {
        // colorLog('same column', 'white', 'violet')
        // same column
        // splice old item
        const oldItems = [...toColumn.items]
        oldFromItem = toColumn.items.splice(fromItemOrder, 1)[0]
        // reset order of list
        toColumn.items.forEach((item, index) => item.itemOrder = index)
        // set new item to end of list
        oldFromItem.itemOrder = toColumn.items.length
        toColumn.items.push(oldFromItem)
        oldItems.forEach(item => {
          const newItem = toColumn.items.filter(_item => _item.itemId == item.itemId)[0]
          boardStore.editRecord(item, newItem)
        })
      }
      else if (fromItemCategory != toColumn.category) {
        // colorLog('diff column', 'white', 'violet')
        // diff column
        oldFromItem = boardStore.getRecordById(fromItemItemId)
        toItemOrder = toColumn.items.length
        newFromItem = {...oldFromItem, category: toColumn.category, itemOrder: toItemOrder, columnOrder: toColumnOrder}
        boardStore.editRecord(oldFromItem, newFromItem)
      }
    }
  
    ctx.emit('board-move')
    // TODO
    // emit update-items to update category
  }

  const pickupColumn = (e: DragEvent, fromColumn: IBoardColumn) => {
    // console.log('pickup columns')
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.dropEffect = 'move'
    
    e.dataTransfer.setData('type', 'column')
    e.dataTransfer.setData('from-column-category', fromColumn.category)
    e.dataTransfer.setData('from-column-order', fromColumn.columnOrder.toString())
  }

  const moveColumn = (e: DragEvent, toColumn: IBoardColumn) => {
    const fromColumnCategory = e.dataTransfer.getData('from-column-category')
    const fromColumnOrder = e.dataTransfer.getData('from-column-order')
    const fromItems = boardStore.getRecordsByCategory(fromColumnCategory)
    const toItems = boardStore.getRecordsByCategory(toColumn.category)
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


