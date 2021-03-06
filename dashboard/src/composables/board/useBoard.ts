import { IBoardColumn } from "./../../interfaces/board/board.column.interface"
import { IBoardItem } from "./../../interfaces/board/board.item.interface"
import { IBoard } from "./../../interfaces/board/board.interface"
import { useStorage } from './../useStorage'
import { BoardStore } from "./../../store/board.store"
import { ref, computed, Ref, watch } from "vue"
import { flattenSort, colorLog } from './../../utils'
import { IBoardable } from "./../../interfaces/board/boardable.interface"

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
      itemOrder: itemOrder,
      item: item
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
  const reinitColumns = (items: IBoardItem[], board: IBoard) => {
    board.columns = {}
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
  const reparseBoard = ((items: IBoardItem[], board: IBoard): IBoard => {
    console.log('begin parse board')
    reinitColumns(items, board)
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
  const reloadBoard = (boardStore: BoardStore, storedBoard: IBoard, boardItems: IBoardItem[]) => {
    console.log('begin load board')
    storedBoard = reparseBoard(boardItems, storedBoard)
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
  const reloadBoardColumnsNoItems = (boardStore: BoardStore, activeBoard: IBoard): IBoardColumn[] => {
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
  const getBoardState = (items: IBoardable[], activeBoardId: string) => {
    console.log('get board state')
    const hasActiveBoard: boolean = !!getBoardFromStorage(activeBoardId)
    const activeBoard = getBoardFromStorage(activeBoardId)
    let storedBoardItems = []
    let storedBoardItemIds = []
    let itemIds: Ref<string[]> = ref([])
    let itemsCategoriesLength
    let storedBoardCategoriesLength
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
      itemIds.value = items.map(item => item.itemId)
      // get array of item ids from all current items in storage (localStorage - may want to build other persisitence layers)
      storedBoardItemIds = storedBoardItems.map(item => item.itemId)
      storedBoardCategoriesLength = storedBoardItems.map(item => item.category).length
      itemsCategoriesLength = items.map(item => item.category).length
      boardHasDiffLength = storedBoardItems.length != items.length 
      boardHasNewItem = itemIds.value.length > storedBoardItemIds.length
      boardHasLessItem = storedBoardItemIds.length > itemIds.value.length
      boardHasDiffCategory =  itemsCategoriesLength != storedBoardCategoriesLength
      boardHasNewCategory = itemsCategoriesLength > storedBoardCategoriesLength
      boardHasLessCategory = storedBoardCategoriesLength > itemsCategoriesLength
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
      newIds = itemIds.value.filter(id => !storedBoardItemIds.includes(id))
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
      surplusIds = storedBoardItemIds.filter(id => !itemIds.value.includes(id))
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
    const columnOrder = (item: IBoardable): number => activeBoard.columns[item.category] ? activeBoard.columns[item.category].columnOrder : Object.keys(activeBoard.columns).length
    const itemOrder = (item: IBoardable, index: number): number => boardStore.getRecordsByCategory(item.category).length + index
    const newInitItems: IBoardItem[] = newItems.map((item, index) => initItem(item, idSymbol, columnOrder(item), itemOrder(item, index)))
    return newInitItems
  }

  const handleDiff = async (activeBoard: IBoard, columns: Ref<IBoardColumn[]>, boardStore: BoardStore, items: IBoardable[], idSymbol: string, activeBoardId: string) => {
    console.log('handle diff')

    activeBoard = getBoardState(items, activeBoardId).activeBoard
    const { hasActiveBoard, storedBoardItems, storedBoardItemIds, itemIds, boardHasDiff, boardHasNewItem, boardHasLessItem, boardHasNewCategory, boardHasLessCategory, categories } = getBoardState(items, activeBoardId)
    const { newIds, newItemsToAdd, surplusIds, itemsToDelete, categoriesToAdd, categoriesToDelete } = await diffBoard(columns, boardStore, items, activeBoardId, idSymbol, activeBoard)
    // if active board exists in storage
    if (boardHasNewCategory) {
        colorLog('board has new category', BOOLCOLOR, BOOLBACK)
        const newInitItems: IBoardItem[] = initNewItems(boardStore, newItemsToAdd, idSymbol, activeBoard)
        initColumns(newInitItems, activeBoard)
        // refactor with new store
        // const storedItems = await loadRecords(boardStore, BOARD, newInitItems)
        boardStore.fetchRecords(newInitItems)
        const storedItems = await boardStore.updateRecords('board')

        const itemsToLoad = storedItems.concat(newInitItems)
        await resetColumns(columns)
        saveBoardToStorage(activeBoard, activeBoard.id)
        columns.value = reloadBoard(boardStore, activeBoard, itemsToLoad)
    }
    if (boardHasLessCategory) {
      colorLog('board has LESS category', BOOLCOLOR, BOOLBACK)
    }
    // consider switching to else if
    if (boardHasNewItem && !boardHasNewCategory) {
      colorLog('board has NEW item', BOOLCOLOR, BOOLBACK)
      const newInitItems = initNewItems(boardStore, newItemsToAdd, idSymbol, activeBoard)
      // refactor with new store
      // const storedItems = await loadRecords(boardStore, BOARD, newInitItems)
      boardStore.fetchRecords(newInitItems)
      const storedItems = await boardStore.updateRecords('board')

      columns.value = reloadBoard(boardStore, activeBoard, storedItems)
    }
    if (boardHasLessItem) {
      colorLog('board has LESS item', BOOLCOLOR, BOOLBACK)
      itemsToDelete.forEach(item => {
        console.log(item.itemId)
        boardStore.deleteRecord(item)
      })
      // refactor with new store
      const newStoredItems: IBoardItem[] = await boardStore.updateRecords('board')
      saveBoardToStorage(activeBoard, activeBoard.id)
      columns.value = reloadBoard(boardStore, activeBoard, newStoredItems)
      console.log(columns.value)
    }

  }

  const resetColumns = async (columns: Ref<IBoardColumn[]>) => {
    console.log('reset columns')
    columns.value = []
    return new Promise(resolve => resolve(true))
  }
//#endregion

const BOOLCOLOR = 'red'
const BOOLBACK  = 'white'
export default async function useBoard(
  columns: Ref<IBoardColumn[]>,
  boardStore: BoardStore,
  items: IBoardable[],
  idSymbol: string,
  activeBoardId: string
) {
  console.log('use board')
  console.log(items.length)
  console.log(boardStore)
  //#region init refs
    // a ref to a board object
    const storedBoard = ref<IBoard>()
    const { hasActiveBoard } = getBoardState(items, activeBoardId)
    let activeBoard
    let boardHasDiff
  //#endregion
  
  if (hasActiveBoard) {
    // if active board exists in storage
    colorLog(`has active board is ${activeBoardId}`, BOOLCOLOR, BOOLBACK)
    activeBoard = getBoardState(items, activeBoardId).activeBoard
    boardHasDiff = getBoardState(items, activeBoardId).boardHasDiff

    const boardItems = columnMapToItemArray(activeBoard.columns)
    // refactor with new store
    // const storedItems = await loadRecords(boardStore, BOARD, boardItems)
    boardStore.fetchRecords(boardItems)
    const storedItems = await boardStore.updateRecords('board')

    columns.value = reloadBoard(boardStore, activeBoard, storedItems)

    if (boardHasDiff) {
      handleDiff(activeBoard, columns, boardStore, items, idSymbol, activeBoardId)
    }

    else if (!boardHasDiff) {
      colorLog('board has NO diff', BOOLCOLOR, BOOLBACK)
      // diff is based on length of input (iboardable) and items (iboarditems)
      // case where board move happens there is no diff
      storedBoard.value = activeBoard
      // flatten column object into item array
      const storedBoardItems = columnMapToItemArray(storedBoard.value.columns)
      // must load items into store | or | set loaded state to true
      boardStore.fetchRecords(storedBoardItems)
      const storedItems = await boardStore.updateRecords('board')

      // const storedItems = await loadRecords(boardStore, BOARD, storedBoardItems)
      saveBoardToStorage(activeBoard, activeBoard.id)

      // must load items into column.value for return of useBoard
      columns.value = reloadBoardColumnsNoItems(boardStore, activeBoard)
    }
  } 

  else if (!hasActiveBoard) {
    colorLog('no active board', BOOLCOLOR, BOOLBACK)
    // if no active board
    // initItems is called from initial items prop
    const boardItems: IBoardItem[] = initItems(items, idSymbol)
    // refactor with new store
    boardStore.fetchRecords(boardItems)
    const storedItems = await boardStore.updateRecords('board')

    // const storedItems = await loadRecords(boardStore, BOARD, boardItems)
    columns.value = loadBoard(boardStore, activeBoard, storedItems)
  }

  const onBoardMove = async () => {
    console.log('on board move')
    activeBoard = getBoardState(items, activeBoardId).activeBoard

    // called when order is modified
    // store loaded needs to be set to true which happens in updateRecords => addRecords
    // which is only reason to have async
    // probably refactor
    // refactor with new store
    const newItems: IBoardItem[] = await boardStore.updateRecords('board')
    // need to wait for columns to be zeroed out so vue reactivity picks up on change in length of array
    // because only updating the order
    await resetColumns(columns)
    saveBoardToStorage(activeBoard, activeBoard.id)
    columns.value = loadBoard(boardStore, activeBoard, newItems)
  }

  const onUpdateBoard = async (items: IBoardable[]) => {
    console.log('use board - onUpdateBoard')
    let activeBoard
    let boardHasDiff

    if (hasActiveBoard) {
      // if active board exists in storage
      colorLog(`has active board is ${activeBoardId}`, BOOLCOLOR, BOOLBACK)
      activeBoard = getBoardState(items, activeBoardId).activeBoard
      boardHasDiff = getBoardState(items, activeBoardId).boardHasDiff
      if (boardHasDiff) {
        colorLog(`board ${activeBoardId} has diff`, BOOLCOLOR, BOOLBACK)

        handleDiff(activeBoard, columns, boardStore, items, idSymbol, activeBoardId)
      }
    }

  }

  const mapItemToData = (items: IBoardable[], item: IBoardItem): IBoardable => {
    const outItem: IBoardable = items.filter(_item => _item.itemId == item.itemId)[0]
    return outItem
  }
  console.log(columns.value)
  return {
    columns,
    onUpdateBoard,
    onBoardMove
  }
}

