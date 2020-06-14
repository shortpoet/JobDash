import { IBoardColumn } from "../interfaces/board/board.column.interface"
import { IBoardItem } from "../interfaces/board/board.item.interface"
import { IBoard } from "../interfaces/board/board.interface"
import { useStorage } from './useStorage'
import { BoardStore } from "../store/board.store"
import { ref, computed, Ref, watch } from "vue"
import { loadRecords, updateRecords, flattenSort } from './../utils'
import { IBoardable } from "../interfaces/board/boardable.interface"

const storage = useStorage()
const BOARD = 'board'
const initItems =  (items: any[], idSymbol: string): IBoardItem[] => {
  // console.log('init board items')
  const itemsOut: IBoardItem[] = [] as IBoardItem[]
  let itemOrder
  const categories = [...new Set(items.map(item => item.category))]
  categories.forEach((category, categoryIndex) => {
    itemOrder = 0
    items.forEach((item, itemIndex) => {
      // console.log(itemIndex)
      if (item.category == category) {
        // console.log(item)
        itemsOut.push(initItem(item, idSymbol, categoryIndex, itemOrder))
        itemOrder++
      }
    })
  })
  return itemsOut
}
// TODO add logic to check if order exists so can run init all the time so reactive two-way 
// between items and boarditems
// otherwise maybe a watch on items but that might not account for changes to specific item properties
const initItem = (item: any, idSymbol: string, columnOrder: number, itemOrder: number): IBoardItem => {
  return {
    itemId: item[idSymbol],
    category: item.category,
    columnOrder: columnOrder,
    itemOrder: itemOrder
  }
}

const parseBoard = ((items: IBoardItem[]): IBoard => {
  // console.log('begin parse board')
  const board = <IBoard>{
    name: 'test board',
    id: '1',
    columns: {} as Record<string, IBoardColumn>
  }
  items.forEach((item: IBoardItem, i) => {
    const itemRecord: Record<number, IBoardItem> = {} as Record<number, IBoardItem>
    itemRecord[item.itemId] = <IBoardItem>item
    if (item.category in board.columns) {
      board.columns[item.category].items[item.itemId] = item
    } else {
      const column: Record<string, IBoardColumn> = {} as Record<string, IBoardColumn>
      column[item.category] = <IBoardColumn>{
        category: item.category,
        columnOrder: item.columnOrder,
        items: {} as Record<number, IBoardItem>
      }
      column[item.category].items[item.itemId] = item
      Object.assign(board['columns'], column)
    }
  })
  // console.log('end parse board')
  // console.log(board)
  return board
})

const orderItems = (itemMap: Record<string, IBoardItem>): IBoardItem[] => {
  // console.log('begin order items')
  const items: IBoardItem[] = []
  Object.entries(itemMap).forEach((entry, index) => {
    if (entry[1].itemOrder == index) {
      items.push(<IBoardItem>{
        itemId: entry[1].itemId,
        category: entry[1].category,      
        itemOrder: entry[1].itemOrder,
        columnOrder: entry[1].columnOrder,
      })
    }
  })
  // console.log(items)
  return items
}

const columnMapToArray = (columnMap: Record<string, IBoardColumn>): IBoardColumn[] => {
  // console.log('begin column map to array');
  
  const columns: IBoardColumn[] = []
  Object.entries(columnMap).forEach((entry, index) => {
    const categoryKey = entry[0]
    const value = entry[1]
    const category = value.category
    const columnOrder = value.columnOrder
    const items = value.items
    // console.log(category)
    const itemMap = {}
    itemMap[category] = orderItems(items)
    const column: IBoardColumn = {
      category: category,
      columnOrder: columnOrder,
      items: itemMap
    }
    // console.log(columnOrder)
    columns.push(column)
  })
  return columns
}
const saveBoardToStorage = (storedBoard: IBoard, boardId: string): void => {
  const storage = useStorage()
  storage.set(`board-${boardId}`, JSON.stringify(storedBoard))
}
const getBoardFromStorage = (boardId: string): IBoard => {
  const storage = useStorage()
  return JSON.parse(storage.get(`board-${boardId}`))
}

const loadBoard = (boardStore: BoardStore, storedBoard: IBoard, boardItems: IBoardItem[]) => {
  // console.log('begin load board')
  storedBoard = parseBoard(boardItems)
  saveBoardToStorage(storedBoard, storedBoard.id)
  const columnMap = ref<Record<string, IBoardColumn>>()
  columnMap.value = storedBoard.columns
  const columns = ref<IBoardColumn[]>()
  columns.value = columnMapToArray(flattenSort(columnMap.value, 'columnOrder'))
  // console.log(columns.value)
  return columns.value
}


const reLoadBoard = (boardStore: BoardStore, storedBoard: IBoard) => {
  // console.log('begin reload board')
  const columnMap = ref<Record<string, IBoardColumn>>()
  columnMap.value = storedBoard.columns
  const columns = ref<IBoardColumn[]>()
  columns.value = columnMapToArray(flattenSort(columnMap.value, 'columnOrder'))
  // console.log(columns.value)
  return columns.value
}

export default async function useBoard(columns: Ref<IBoardColumn[]>, boardStore: BoardStore, items: IBoardable[], idSymbol: string, activeBoard: string) {
  // console.log('use board')

  const allItems = ref()
  allItems.value = items
  const resetColumns = async () => {
    // console.log('reset columns')
    columns.value = []
    return new Promise(resolve => resolve(true))
  }
  const storedBoard = ref<IBoard>()

  watch(
    () => allItems.value,
    (value: string, previous: string) => {
      if(previous) {
        if (value.length != previous.length) {
          console.log('task length change from use board')
        }
      }
    },
    {immediate: true}
  )
  // if active board exists in storage
  if (getBoardFromStorage(activeBoard)) {
    console.log(`active board is ${activeBoard}`)
    storedBoard.value = getBoardFromStorage(activeBoard)
    const storedBoardItems = []
    Object.entries(storedBoard.value.columns).forEach(entry => Object.entries(entry[1].items).forEach(_entry => storedBoardItems.push( _entry[1])))



    // must load items into store | or | set loaded state to true
    const storedItems = await loadRecords(boardStore, BOARD, storedBoardItems)
    // must load items into column.value for return of useBoard
    columns.value = reLoadBoard(boardStore, storedBoard.value)
  
  // if no active board
  } else {
    const boardItems: IBoardItem[] = initItems(items, idSymbol)
  
    const storedItems = await loadRecords(boardStore, BOARD, boardItems)
    columns.value = loadBoard(boardStore, storedBoard.value, storedItems)
  }

  // const boardItems: IBoardItem[] = initItems(items, idSymbol)

  // const storedItems = await loadRecords(boardStore, BOARD, boardItems)
  // columns.value = loadBoard(boardStore, storedBoard.value, storedItems)


  const columnsComputed = computed(() => {
    // console.log('$$$ computing columns');
    // console.log(columns.value.map(item => item.category))
    // console.log(columns.value.map(item => item.columnOrder))
    // console.log(columns.value.map(item => Object.entries(item.items).map(entry => entry[1].itemId)))
    return columns.value
  })

  // const computedBoard = computed(() => parseBoard(storedItems))
  // const columns = computed(() => orderColumns(computedBoard.value.columns))

  const onUpdateBoard = async () => {
    console.log('use board - onUpdateBoard')

    storedBoard.value = getBoardFromStorage(activeBoard)
    const storedBoardItems = []
    Object.entries(storedBoard.value.columns).forEach(entry => Object.entries(entry[1].items).forEach(_entry => storedBoardItems.push( _entry[1])))
    console.log(items.length)
    console.log(storedBoardItems.length)

    if (storedBoardItems.length != items.length) {
      console.log('new items length from on update board')
      const itemIds = items.map(item => item.itemId)
      const storedBoardItemIds = storedBoardItems.map(item => item.itemId)
      const newIds = itemIds.filter(id => !storedBoardItemIds.includes(id))
      console.log(newIds)
      const newItems = []
      items.forEach(item => {
      })
      console.log(newItems)
    }

    // const newItems: IBoardItem[] = await updateRecords(boardStore, BOARD)
    // // console.log(newItems)
    // // console.log(newItems.map(item => item.itemId));
    // // console.log(newItems.map(item => item.itemOrder));
    // // console.log(newItems.map(item => item.category));
    // // console.log(newItems.map(item => item.columnOrder));
    // // need to wait for columns to be zeroed out so vue reactivity picks up on change in length of array
    // await resetColumns()
    // saveBoardToStorage(storedBoard.value, storedBoard.value.id)
    // columns.value = loadBoard(boardStore, storedBoard.value, newItems)
  }

  return {
    columns,
    columnsComputed,
    onUpdateBoard
  }
}
