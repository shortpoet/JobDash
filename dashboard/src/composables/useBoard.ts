import { IBoardColumn } from "../interfaces/board/board.column.interface"
import { IBoardItem } from "../interfaces/board/board.item.interface"
import { IBoard } from "../interfaces/board/board.interface"
import { useStorage } from './useStorage'
import { BoardStore } from "../store/board.store"
import { ref, computed, Ref, watch } from "vue"
import { loadRecords, updateRecords, flattenSort } from './../utils'
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
  // map board items into a board
  // hard codes board name and id for now
  const parseBoard = ((items: IBoardItem[]): IBoard => {
    // console.log('begin parse board')
    const board = <IBoard>{
      name: 'test board',
      id: '1',
      columns: {} as Record<string, IBoardColumn>
    }
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
    // console.log('end parse board')
    // console.log(board)
    return board
  })
//#endregion

//#region load and sort board
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
  const reloadBoard = (boardStore: BoardStore, storedBoard: IBoard) => {
    // console.log('begin reload board')
    const columnMap = ref<Record<string, IBoardColumn>>()
    columnMap.value = storedBoard.columns
    const columns = ref<IBoardColumn[]>()
    columns.value = columnMapToColumnArray(flattenSort(columnMap.value, 'columnOrder'))
    // console.log(columns.value)
    return columns.value
  }
//#endregion

//#region data mapping
  // to remap 
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

export default async function useBoard(columns: Ref<IBoardColumn[]>, boardStore: BoardStore, items: IBoardable[], idSymbol: string, activeBoard: string) {
  //#region init refs
    console.log('use board')
    const allItems = ref()
    allItems.value = items
    // a ref to a board object
    const storedBoard = ref<IBoard>()
  //#endregion

  const resetColumns = async () => {
    // console.log('reset columns')
    columns.value = []
    return new Promise(resolve => resolve(true))
  }
  //#region experimental
    // option to try with computed to see if that affect reactivity
    const columnsComputed = computed(() => {
      return columns.value
    })
  //#endregion
  
  // if active board exists in storage
  if (getBoardFromStorage(activeBoard)) {
    console.log(`active board is ${activeBoard}`)
    storedBoard.value = getBoardFromStorage(activeBoard)
    const storedBoardItems = columnMapToItemArray(storedBoard.value.columns)
    // flatten column object into item array
    // Object.entries(storedBoard.value.columns).forEach(entry => Object.entries(entry[1].items).forEach(_entry => storedBoardItems.push( _entry[1])))
    // must load items into store | or | set loaded state to true
    const storedItems = await loadRecords(boardStore, BOARD, storedBoardItems)
    // must load items into column.value for return of useBoard
    columns.value = reloadBoard(boardStore, storedBoard.value)
  // if no active board
  // initItems is called from initial items prop
  } else {
    const boardItems: IBoardItem[] = initItems(items, idSymbol)
    const storedItems = await loadRecords(boardStore, BOARD, boardItems)
    columns.value = loadBoard(boardStore, storedBoard.value, storedItems)
  }


  const onUpdateBoard = async () => {
    console.log('use board - onUpdateBoard')
    storedBoard.value = getBoardFromStorage(activeBoard)
    const storedBoardItems = []
    // flatten column object into item array
    Object.entries(storedBoard.value.columns).forEach(entry => Object.entries(entry[1].items).forEach(_entry => storedBoardItems.push( _entry[1])))
    console.log(items.length)
    console.log(storedBoardItems.length)
    if (storedBoardItems.length != items.length) {
      console.log('new items length from on update board')
      console.log(items)
      const itemIds = items.map(item => item.itemId)
      const storedBoardItemIds = storedBoardItems.map(item => item.itemId)
      console.log(itemIds)
      console.log(storedBoardItemIds)
      if (itemIds.length > storedBoardItemIds.length) {
        console.log('new item')
        const newIds = itemIds.filter(id => !storedBoardItemIds.includes(id))
        console.log(newIds)
        const newItems = items.filter(item => newIds.includes(item.itemId))
        console.log(newItems)
        const boardItems: IBoardItem[] = [] as IBoardItem[]
        const columnOrder = (item: IBoardable): number => boardStore.getRecordsByCategory(item.category)[0].columnOrder
        const itemOrder = (item: IBoardable, index: number): number => boardStore.getRecordsByCategory(item.category).length + index
        const newInitItems: IBoardItem[] = newItems.map((item, index) => initItem(item, idSymbol, columnOrder(item), itemOrder(item, index)))
        console.log(newInitItems)
        boardStore.addRecords(newInitItems, idSymbol)
        const storedItems = await loadRecords(boardStore, BOARD, newInitItems)
        // await resetColumns()
        // TODO make new board
        // saveBoardToStorage(storedBoard.value, storedBoard.value.id)
        columns.value = loadBoard(boardStore, storedBoard.value, storedItems)
      } else {
        console.log('one less item')
        const newIds = storedBoardItemIds.filter(id => !itemIds.includes(id))
        console.log(newIds)
        const itemsToDelete = storedBoardItems.filter(item => newIds.includes(item.itemId))
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
    // store loaded needs to be set to true
    const newItems: IBoardItem[] = await updateRecords(boardStore, BOARD)
    // console.log(newItems.map(item => item.columnOrder));
    // need to wait for columns to be zeroed out so vue reactivity picks up on change in length of array
    // because only updating the order
    await resetColumns()
    saveBoardToStorage(storedBoard.value, storedBoard.value.id)
    columns.value = loadBoard(boardStore, storedBoard.value, newItems)
  }

  return {
    columns,
    columnsComputed,
    onUpdateBoard
  }
}
