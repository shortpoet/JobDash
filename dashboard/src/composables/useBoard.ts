import { IBoardColumn } from "../interfaces/board/board.column.interface"
import { IBoardItem } from "../interfaces/board/board.item.interface"
import { IBoard } from "../interfaces/board/board.interface"
import { useStorage } from './useStorage'
import { BoardStore } from "../store/board.store"
import { ref, computed, Ref } from "vue"
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
    id: 1,
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

const orderItems = (itemMap: Record<number, IBoardItem>): IBoardItem[] => {
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

const orderColumns = (columnMap: Record<number, IBoardColumn>): IBoardColumn[] => {
  // console.log('begin order columns')
  const columns: IBoardColumn[] = []
  let categorized = []
  const categoryCount = Object.keys(columnMap).length
  while (columns.length < categoryCount) {
    Object.entries(columnMap).forEach((entry, index) => {
      const categoryKey = entry[0]
      const value = entry[1]
      const category = value.category
      const columnOrder = value.columnOrder
      const items = value.items
      const column: IBoardColumn = {
        category: category,
        columnOrder: columnOrder,
        items: orderItems(items)
      }
      // console.log(columnOrder)
      columns.push(columns.filter(column => column.columnOrder == index)[0])
      // console.log(categorized)
      // if (columnOrder == index && !categorized.includes(category)) {
      if (columnOrder == index && !columns.includes(column)) {
        // console.log(categorized)
        // console.log(index)
        columns.push(column)
        // categorized.push(category)
      }
    })
  }
  return columns
}

const columnMapToArray = (columnMap: Record<number, IBoardColumn>): IBoardColumn[] => {
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
      items: orderItems(items)
    }
    // console.log(columnOrder)
    columns.push(column)
  })
  return columns
}

const loadBoard = (boardStore: BoardStore, storedBoard: IBoard, boardItems: IBoardItem[]) => {
  // console.log('begin load board')
  storedBoard = parseBoard(boardItems)
  const columnMap = ref<Record<string, IBoardColumn>>()
  columnMap.value = storedBoard.columns
  const columns = ref<IBoardColumn[]>()
  columns.value = columnMapToArray(flattenSort(columnMap.value, 'columnOrder'))
  // console.log(columns.value)
  return columns.value
}

export default async function useBoard(columns: Ref<IBoardColumn[]>, boardStore: BoardStore, items: IBoardable[], idSymbol: string) {
  // console.log('use board')

  const resetColumns = async () => {
    // console.log('reset columns')
    columns.value = []
    return new Promise(resolve => resolve(true))
  }
  const storedBoard = ref<IBoard>()
  const boardItems: IBoardItem[] = initItems(items, idSymbol)
  const storedItems = await loadRecords(boardStore, BOARD, boardItems)
  columns.value = loadBoard(boardStore, storedBoard.value, storedItems)
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
    // console.log('use board - update')
    const newItems: IBoardItem[] = await updateRecords(boardStore, BOARD)
    // console.log(newItems)
    // console.log(newItems.map(item => item.itemId));
    // console.log(newItems.map(item => item.itemOrder));
    // console.log(newItems.map(item => item.category));
    // console.log(newItems.map(item => item.columnOrder));
    // need to wait for columns to be zeroed out so vue reactivity picks up on change in length of array
    await resetColumns()
    columns.value = loadBoard(boardStore, storedBoard.value, newItems)
  }

  return {
    columns,
    columnsComputed,
    onUpdateBoard
  }
}
