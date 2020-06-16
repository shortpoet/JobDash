import { IBoardColumn } from "../interfaces/board/board.column.interface"
import { IBoardItem } from "../interfaces/board/board.item.interface"
import { IBoard } from "../interfaces/board/board.interface"
import { useStorage } from './useStorage'
import { BoardStore } from "../store/board.store"
import { ref, computed, Ref, watch } from "vue"
import { loadRecords, updateRecords, flattenSort, colorLog } from './../utils'
import { IBoardable } from "../interfaces/board/boardable.interface"

const BOARD = 'board'
//#region storage
  const storage = useStorage()
  const saveBoardToStorage = (storedBoard: IBoard, boardId: string): void => {
    const storage = useStorage()
    storage.set(`board-${boardId}`, JSON.stringify(storedBoard))
  }

  const getBoardFromStorage = (boardId: string): IBoard => {
    const storage = useStorage()
    return JSON.parse(storage.get(`board-${boardId}`))
  }
//#endregion

//#region init items
  // take initial items and split into categories then map into board items
  // sets category order based on order of load
  // sets itemorder w/in category based on load order index
  const initItems =  (items: any[], idSymbol: string): IBoardItem[] => {
    const itemsOut: IBoardItem[] = [] as IBoardItem[]
    let itemOrder
    const categories = [...new Set(items.map(item => item.category))]
    categories.forEach((category, categoryIndex) => {
      itemOrder = 0
      items.forEach((item, itemIndex) => {
        if (item.category == category) {
          itemsOut.push(initItem(item, idSymbol, categoryIndex, itemOrder))
          itemOrder++
        }
      })
    })
    return itemsOut
  }
  // map a new item into a board item
  const initItem = (item: any, idSymbol: string, columnOrder: number, itemOrder: number): IBoardItem => {
    return {
      itemId: item[idSymbol],
      category: item.category,
      columnOrder: columnOrder,
      itemOrder: itemOrder
    }
  }
//#endregion

//#region init board
  const initColumns = (items: IBoardItem[], board: IBoard) => {
    console.log('init columns')
    items.forEach((item: IBoardItem, i) => {
      if (item.category in board.columns) {
        board.columns[item.category].items.push(item)
      } else {
        const column: Record<string, IBoardColumn> = {} as Record<string, IBoardColumn>
        column[item.category] = <IBoardColumn>{
          category: item.category,
          columnOrder: item.columnOrder,
          items: [] as IBoardItem[]
        }
        column[item.category].items.push(item)
        Object.assign(board['columns'], column)
      }
    })
  }

  // map board items into a board
  // hard codes board name and id for now
  const parseBoard = ((items: IBoardItem[]): IBoard => {
    console.log('begin parse board')
    const board = <IBoard>{
      name: 'test board',
      id: '1',
      columns: {} as Record<string, IBoardColumn>
    }
    initColumns(items, board)
    return board
  })
//#endregion

//#region re/load and sort board compound functions
  const loadBoard = (boardStore: BoardStore, storedBoard: IBoard, boardItems: IBoardItem[]) => {
    console.log('begin load board')
    storedBoard = parseBoard(boardItems)
    saveBoardToStorage(storedBoard, storedBoard.id)
    const columnMap = ref<Record<string, IBoardColumn>>()
    columnMap.value = storedBoard.columns
    const columns = ref<IBoardColumn[]>()
    const sorted = flattenSort(columnMap.value, 'columnOrder')
    columns.value = columnMapToColumnArray(sorted)
    columns.value.forEach(column => {
      column.items = column.items.sort((a, b) => a.itemOrder - b.itemOrder)
    })
    return columns.value
  }
  // resort and remap dictionary of <category, Column> to [Column]
  const reloadBoard = (boardStore: BoardStore, activeBoard: IBoard) => {
    // console.log('begin reload board')
    const columnMap = ref<Record<string, IBoardColumn>>()
    columnMap.value = activeBoard.columns
    const columns = ref<IBoardColumn[]>()
    columns.value = columnMapToColumnArray(flattenSort(columnMap.value, 'columnOrder'))
    // without this the moved item will sometimes jump to top
    columns.value.forEach(column => {
      column.items = column.items.sort((a, b) => a.itemOrder - b.itemOrder)
    })    
    // console.log(columns.value)
    return columns.value
  }
//#endregion

//#region data mapping
  // to remap after sorting
  const columnMapToColumnArray = (columnMap: Record<string, IBoardColumn>): IBoardColumn[] => {
    // console.log('begin column map to array');
    const columns: IBoardColumn[] = []
    Object.entries(columnMap).forEach((entry, index) => {
      const categoryKey = entry[0]
      const value = entry[1]
      const category = value.category
      const columnOrder = value.columnOrder
      const items = value.items
      // console.log(category)
      const column: IBoardColumn = {
        category: category,
        columnOrder: columnOrder,
        items: items
      }
      // console.log(columnOrder)
      columns.push(column)
    })
    return columns
  }

  // to diff items
  const columnMapToItemArray = (columnMap: Record<string, IBoardColumn>): IBoardItem[] => {
    const out: IBoardItem[] = []
    // Object.entries(columnMap).forEach(columnDict => {
    //   Object.entries(columnDict[1].items).forEach(itemDict => {
    //     out.push(itemDict[1])
    //   })
    // })
    Object.entries(columnMap).forEach(entry => Object.entries(entry[1].items).forEach(_entry => out.push( _entry[1])))
    return out
  }
//#endregion

const getBoardState = (items: IBoardable[], activeBoardId: string) => {
  console.log('get board state')
  const hasActiveBoard: boolean = !!getBoardFromStorage(activeBoardId)
  const activeBoard = getBoardFromStorage(activeBoardId)
  let storedBoardItems = []
  let storedBoardItemIds = []
  let itemIds = []
  let boardHasDiff: boolean
  let boardHasDiffLength: boolean
  let boardHasDiffCategory: boolean
  let boardHasNewItem: boolean
  let boardHasLessItem: boolean
  let boardHasNewCategory: boolean
  let boardHasLessCategory: boolean
  let categories
  if(hasActiveBoard) {
    // flatten column object into item array
    storedBoardItems = columnMapToItemArray(activeBoard.columns)
    // get array of item ids from all current items in props
    itemIds = items.map(item => item.itemId)
    // get array of item ids from all current items in storage (localStorage - may want to build other persisitence layers)
    storedBoardItemIds = storedBoardItems.map(item => item.itemId)
    boardHasDiffLength = storedBoardItems.length != items.length 
    boardHasNewItem = itemIds.length > storedBoardItemIds.length
    boardHasLessItem = storedBoardItemIds.length > itemIds.length
    boardHasDiffCategory =  itemIds.map(item => item.category).length != storedBoardItems.map(item => item.category).length
    boardHasNewCategory = itemIds.map(item => item.category).length > storedBoardItems.map(item => item.category).length
    boardHasLessCategory = storedBoardItems.map(item => item.category).length > itemIds.map(item => item.category).length
    categories = [...new Set(items.map(item => item.category))]
    boardHasDiff = boardHasDiffLength || boardHasDiffCategory
  }
  return {
    hasActiveBoard,
    activeBoard,
    storedBoardItemIds,
    storedBoardItems,
    itemIds,
    boardHasDiff,
    boardHasDiffLength,
    boardHasDiffCategory,
    boardHasNewItem,
    boardHasLessItem,
    boardHasNewCategory,
    boardHasLessCategory,
    categories
  }
}

const _diffBoard = async (columns: Ref<IBoardColumn[]>, boardStore: BoardStore, items: IBoardable[], activeBoardId: string, idSymbol: string, storedBoard: Ref<IBoard>) => {

  const { hasActiveBoard, activeBoard, storedBoardItems, itemIds, boardHasDiff, boardHasNewItem, boardHasLessItem } = getBoardState(items, activeBoardId)

  if (boardHasDiff) {
    console.log('new items length from on update board')
    // console.log(items)
    // get array of item ids from all current items in props
    const itemIds = items.map(item => item.itemId)
    // get array of item ids from all current items in storage (localStorage - may want to build other persisitence layers)
    const storedBoardItemIds = storedBoardItems.map(item => item.itemId)
    // console.log(itemIds)
    // console.log(storedBoardItemIds)
    if (boardHasNewItem) {
      // case there are more items in props
      console.log('new item')
      // get new items from diffing
      const newIds = itemIds.filter(id => !storedBoardItemIds.includes(id))
      // console.log(newIds)
      const newItems = items.filter(item => newIds.includes(item.itemId))
      // console.log(newItems)
      // init new items
      const boardItems: IBoardItem[] = [] as IBoardItem[]
      const columnOrder = (item: IBoardable): number => boardStore.getRecordsByCategory(item.category)[0].columnOrder
      const itemOrder = (item: IBoardable, index: number): number => boardStore.getRecordsByCategory(item.category).length + index
      const newInitItems: IBoardItem[] = newItems.map((item, index) => initItem(item, idSymbol, columnOrder(item), itemOrder(item, index)))
      // console.log(newInitItems)

      //#region question/experiment
        // add records to board store
        boardStore.addRecords(newInitItems, idSymbol)
        // this should do the same thing since we are providing data
        const storedItems = await loadRecords(boardStore, BOARD, newInitItems)
        // await resetColumns()
        // TODO make new board
        // saveBoardToStorage(storedBoard.value, storedBoard.value.id)
        columns.value = loadBoard(boardStore, storedBoard.value, storedItems)
      //#endregion

    } 
    if (boardHasLessItem) {
      // case there are more items in props
      console.log('one less item')
      // get new items from diffing the inverse list
      const extraIds = storedBoardItemIds.filter(id => !itemIds.includes(id))
      console.log(extraIds)
      const itemsToDelete = storedBoardItems.filter(item => extraIds.includes(item.itemId))
      console.log(itemsToDelete)
      itemsToDelete.forEach(item => {
        console.log(item)
        // boardStore.deleteRecord(item)
        // when it gets deleted , the array lenghts are equal
        // then load gets called and the item is undefined
      })
      // columns.value = reloadBoard(boardStore, storedBoard.value)
    }
  }

}
const diffBoard = async (columns: Ref<IBoardColumn[]>, boardStore: BoardStore, items: IBoardable[], activeBoardId: string, idSymbol: string, storedBoard: IBoard) => {

  // getBoardState(items, activeBoardId)
  const { hasActiveBoard } = getBoardState(items, activeBoardId)
  
  let newIds = []
  let newItemsToAdd = []
  let allNewCategories = []
  let categoriesToAdd = []
  let categoriesToDelete = []
  let surplusIds = []
  let itemsToDelete = []
  
  if (hasActiveBoard) {
    const { activeBoard, storedBoardItems, storedBoardItemIds, itemIds, boardHasDiff, boardHasNewItem, boardHasLessItem, boardHasNewCategory, boardHasLessCategory, categories } = getBoardState(items, activeBoardId)

    console.log('diff board')
    // get new items from diffing
    newIds = itemIds.filter(id => !storedBoardItemIds.includes(id))
    // console.log(newIds)
    newItemsToAdd = items.filter(item => newIds.includes(item.itemId))
    // console.log(newItemsToAdd)
    allNewCategories = [...new Set(newItemsToAdd.map(item => item.category))]
    // console.log(allNewCategories)
    categoriesToAdd = allNewCategories.filter(category => !categories.includes(category))
    // console.log(categoriesToAdd)
    categoriesToDelete = categories.filter(category => !allNewCategories.includes(category))
    // console.log(categoriesToAdd)
  
    // get new items from diffing the inverse list
    surplusIds = storedBoardItemIds.filter(id => !itemIds.includes(id))
    // console.log(extraIds)
    itemsToDelete = storedBoardItems.filter(item => surplusIds.includes(item.itemId))
    // console.log(itemsToDelete)
    return {
      newIds,
      newItemsToAdd,
      surplusIds,
      itemsToDelete,
      categoriesToAdd,
      categoriesToDelete
    }
  }

}

const initNewItems = (boardStore: BoardStore, newItems: IBoardable[], idSymbol: string, activeBoard: IBoard): IBoardItem[] => {
  console.log('init new items')
  const boardItems: IBoardItem[] = [] as IBoardItem[]
  console.log(activeBoard)
  const columnOrder = (item: IBoardable): number => activeBoard.columns[item.category] ? activeBoard.columns[item.category].columnOrder : Object.keys(activeBoard.columns).length
  const itemOrder = (item: IBoardable, index: number): number => boardStore.getRecordsByCategory(item.category).length + index
  const newInitItems: IBoardItem[] = newItems.map((item, index) => initItem(item, idSymbol, columnOrder(item), itemOrder(item, index)))
  console.log(newInitItems)
  return newInitItems
}
const BOOLCOLOR = 'red'
const BOOLBACK  = 'white'
export default async function useBoard(columns: Ref<IBoardColumn[]>, boardStore: BoardStore, items: IBoardable[], idSymbol: string, activeBoardId: string) {
  console.log('use board')
  //#region init refs
    const allItems = ref()
    allItems.value = items
    // a ref to a board object
    const storedBoard = ref<IBoard>()
  //#endregion
  
  const { hasActiveBoard } = getBoardState(items, activeBoardId)
  const resetColumns = async () => {
    console.log('reset columns')
    columns.value = []
    return new Promise(resolve => resolve(true))
  }
  //#region experimental
  // option to try with computed to see if that affect reactivity
  const columnsComputed = computed(() => {
    return columns.value
  })
  //#endregion
  let activeBoard
  if (hasActiveBoard) {
    activeBoard = getBoardState(items, activeBoardId).activeBoard
    const { hasActiveBoard, storedBoardItems, storedBoardItemIds, itemIds, boardHasDiff, boardHasNewItem, boardHasLessItem, boardHasNewCategory, boardHasLessCategory, categories } = getBoardState(items, activeBoardId)
    const { newIds, newItemsToAdd, surplusIds, itemsToDelete, categoriesToAdd, categoriesToDelete } = await diffBoard(columns, boardStore, items, activeBoardId, idSymbol, activeBoard)
    // if active board exists in storage
    colorLog(`has active board is ${activeBoardId}`, BOOLCOLOR, BOOLBACK)
    const boardItems = columnMapToItemArray(activeBoard.columns)
    const storedItems = await loadRecords(boardStore, BOARD, boardItems)
    columns.value = loadBoard(boardStore, activeBoard, storedItems)
    if (boardHasDiff) {
      colorLog('board HAS diff', BOOLCOLOR, BOOLBACK)
      if (boardHasNewCategory) {
        colorLog('board has new category', BOOLCOLOR, BOOLBACK)
        const newInitItems: IBoardItem[] = initNewItems(boardStore, newItemsToAdd, idSymbol, activeBoard)
        initColumns(newInitItems, activeBoard)
        const storedItems = await loadRecords(boardStore, BOARD, newInitItems)
        columns.value = loadBoard(boardStore, activeBoard, storedItems)
        await resetColumns()
        saveBoardToStorage(activeBoard, activeBoard.id)
        console.log(columns.value)
      }
      // if (boardHasLessCategory) {
      //   colorLog('board has new category', BOOLCOLOR, BOOLBACK)
      //   const newInitItems: IBoardItem[] = initNewItems(boardStore, newItemsToAdd, idSymbol, activeBoard)
      //   initColumns(newInitItems, activeBoard)
      //   const storedItems = await loadRecords(boardStore, BOARD, newInitItems)
      //   columns.value = loadBoard(boardStore, activeBoard, storedItems)
      //   await resetColumns()
      //   saveBoardToStorage(activeBoard, activeBoard.id)
      //   console.log(columns.value)
      // }
      // consider switching to else if
      if (boardHasNewItem && !boardHasNewCategory) {
        colorLog('board has NEW item', BOOLCOLOR, BOOLBACK)
        const newInitItems = initNewItems(boardStore, newItemsToAdd, idSymbol, activeBoard)
        const storedItems = await loadRecords(boardStore, BOARD, newInitItems)
        columns.value = loadBoard(boardStore, activeBoard, storedItems)
      }
      if (boardHasLessItem && !boardHasLessCategory) {
        colorLog('board has LESS item', BOOLCOLOR, BOOLBACK)
        itemsToDelete.forEach(item => {
          boardStore.deleteRecord(item)
        })
        saveBoardToStorage(activeBoard, activeBoard.id)
        columns.value = reloadBoard(boardStore, activeBoard)
        // maybe try this
        // const newItems: IBoardItem[] = await updateRecords(boardStore, BOARD)
        // // need to wait for columns to be zeroed out so vue reactivity picks up on change in length of array
        // // because only updating the order
        // await resetColumns()
        // saveBoardToStorage(activeBoard, activeBoard.id)
        // columns.value = loadBoard(boardStore, activeBoard, newItems)
      }
    }
    if (!boardHasDiff) {
      colorLog('board has NO diff', BOOLCOLOR, BOOLBACK)
      // diff is based on length of input (iboardable) and items (iboarditems)
      // case where board move happens there is no diff
      storedBoard.value = activeBoard
      // flatten column object into item array
      const storedBoardItems = columnMapToItemArray(storedBoard.value.columns)
      // must load items into store | or | set loaded state to true
      const storedItems = await loadRecords(boardStore, BOARD, storedBoardItems)
      saveBoardToStorage(activeBoard, activeBoard.id)

      // must load items into column.value for return of useBoard
      columns.value = reloadBoard(boardStore, activeBoard)
    }
  } 

  if (!hasActiveBoard) {
    colorLog('no active board', BOOLCOLOR, BOOLBACK)
    // if no active board
    // initItems is called from initial items prop
    const boardItems: IBoardItem[] = initItems(items, idSymbol)
    const storedItems = await loadRecords(boardStore, BOARD, boardItems)
    columns.value = loadBoard(boardStore, activeBoard, storedItems)
  }

  const onBoardMove = async () => {
    console.log('on board move')
    activeBoard = getBoardState(items, activeBoardId).activeBoard

    // called when order is modified
    // store loaded needs to be set to true which happens in updateRecords => addRecords
    // which is only reason to have async
    // probably refactor
    const newItems: IBoardItem[] = await updateRecords(boardStore, BOARD)
    // need to wait for columns to be zeroed out so vue reactivity picks up on change in length of array
    // because only updating the order
    await resetColumns()
    saveBoardToStorage(activeBoard, activeBoard.id)
    columns.value = loadBoard(boardStore, activeBoard, newItems)
  }

  const onUpdateBoard = async () => {
    console.log('use board - onUpdateBoard')
    _diffBoard(columns, boardStore, items, activeBoardId, idSymbol, storedBoard)
    // const newItems: IBoardItem[] = await updateRecords(boardStore, BOARD)
    // saveBoardToStorage(storedBoard.value, storedBoard.value.id)
    // columns.value = loadBoard(boardStore, storedBoard.value, newItems)
  }

  return {
    columns,
    columnsComputed,
    onUpdateBoard,
    onBoardMove
  }
}


// if (boardHasDiff) {
//   console.log('new items length from on update board')
//   // console.log(items)
//   // get array of item ids from all current items in props
//   const itemIds = items.map(item => item.itemId)
//   // get array of item ids from all current items in storage (localStorage - may want to build other persisitence layers)
//   const storedBoardItemIds = storedBoardItems.map(item => item.itemId)
//   // console.log(itemIds)
//   // console.log(storedBoardItemIds)
//   if (boardHasNewItem) {
//     // case there are more items in props
//     console.log('new item')
//     // get new items from diffing
//     const newIds = itemIds.filter(id => !storedBoardItemIds.includes(id))
//     // console.log(newIds)
//     const newItems = items.filter(item => newIds.includes(item.itemId))
//     // console.log(newItems)
//     // init new items
//     const boardItems: IBoardItem[] = [] as IBoardItem[]
//     const columnOrder = (item: IBoardable): number => boardStore.getRecordsByCategory(item.category)[0].columnOrder
//     const itemOrder = (item: IBoardable, index: number): number => boardStore.getRecordsByCategory(item.category).length + index
//     const newInitItems: IBoardItem[] = newItems.map((item, index) => initItem(item, idSymbol, columnOrder(item), itemOrder(item, index)))
//     // console.log(newInitItems)

//     //#region question/experiment
//       // add records to board store
//       boardStore.addRecords(newInitItems, idSymbol)
//       // this should do the same thing since we are providing data
//       const storedItems = await loadRecords(boardStore, BOARD, newInitItems)
//       // await resetColumns()
//       // TODO make new board
//       // saveBoardToStorage(storedBoard.value, storedBoard.value.id)
//       columns.value = loadBoard(boardStore, storedBoard.value, storedItems)
//     //#endregion

//   } else {
//     // case there are more items in props
//     console.log('one less item')
//     // get new items from diffing the inverse list
//     const newIds = storedBoardItemIds.filter(id => !itemIds.includes(id))
//     console.log(newIds)
//     const itemsToDelete = storedBoardItems.filter(item => newIds.includes(item.itemId))
//     console.log(itemsToDelete)
//     itemsToDelete.forEach(item => {
//       console.log(item)
//       // boardStore.deleteRecord(item)
//       // when it gets deleted , the array lenghts are equal
//       // then load gets called and the item is undefined
//     })
//     // columns.value = reloadBoard(boardStore, storedBoard.value)
//   }
// }
