import { IBoardColumn } from "../interfaces/board/board.column.interface"
import { IBoardItem } from "../interfaces/board/board.item.interface"
import { IBoard } from "../interfaces/board/board.interface"
import { useStorage } from './useStorage'
import { BoardStore } from "../store/board.store"
import { ref, computed, Ref } from "vue"
import { loadRecords, updateRecords } from './../utils'
import { IBoardable } from "../interfaces/board/boardable.interface"

const storage = useStorage()
const BOARD = 'board'
const initItems =  (items: any[], idSymbol: string): IBoardItem[] => {
  console.log('init board items')
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

const initItem = (item: any, idSymbol: string, columnOrder: number, itemOrder: number): IBoardItem => {
  return {
    itemId: item[idSymbol],
    category: item.category,
    columnOrder: columnOrder,
    itemOrder: itemOrder
  }
}

const parseBoard = ((items: IBoardItem[]): IBoard => {
  console.log('begin parse board')
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
  console.log('begin order items')
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
  console.log('begin order columns')
  const columns: IBoardColumn[] = []
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
    if (columnOrder == index) {
      columns.push(column)
    }
  })
  return columns
}

// const _loadBoard = async (boardStore: BoardStore, storedBoard: IBoard, boardItems: IBoardItem[]) => {
//   const storedItems = await loadRecords(boardStore, BOARD, boardItems)
//   storedBoard = parseBoard(storedItems)
//   const columnMap = ref<Record<string, IBoardColumn>>()
//   columnMap.value = storedBoard.columns
//   const columns = ref<IBoardColumn[]>()
//   columns.value = orderColumns(columnMap.value)
//   return columns.value
// }
const loadBoard = async (boardStore: BoardStore, storedBoard: IBoard, boardItems: IBoardItem[]) => {
  storedBoard = parseBoard(boardItems)
  const columnMap = ref<Record<string, IBoardColumn>>()
  columnMap.value = storedBoard.columns
  const columns = ref<IBoardColumn[]>()
  columns.value = orderColumns(columnMap.value)
  return columns.value
}

export default async function useBoard(columns: Ref<IBoardColumn[]>, boardStore: BoardStore, items: IBoardable[], idSymbol: string) {
  console.log('use board')
  
  const storedBoard = ref<IBoard>()

  const boardItems: IBoardItem[] = initItems(items, idSymbol)
  const storedItems = await loadRecords(boardStore, BOARD, boardItems)

  columns.value = await loadBoard(boardStore, storedBoard.value, storedItems)


  // const computedBoard = computed(() => parseBoard(storedItems))
  // const columns = computed(() => orderColumns(computedBoard.value.columns))

  const onUpdateBoard = async () => {
    console.log('use board - update')
    const newItems = await updateRecords(boardStore, BOARD)
    columns.value = await loadBoard(boardStore, storedBoard.value, newItems)

  }


  return {
    columns,
    onUpdateBoard
  }
}


// export default function useBoard(items: any[], idSymbol: string) {
//   console.log('use board')
  
//   const board: IBoard = loadBoard(items, idSymbol)

//   const onUpdateBoard = async () => {
//     console.log('use board - update') 
//     const newBoard = await updateBoard(items, board)
//   }


//   return {
//     board,
//     onUpdateBoard
//   }
// }


// export const loadBoard = (items: IBoardItem[], idSymbol:string): IBoard => {
//   console.log(`load records for ${'board'}`)

//   const boardItems: IBoardItem[] = (initItems(items, idSymbol))

//   const board = <IBoard>{}
//   if (board.columns == undefined && items.length > 0) {
//     console.log('init empty board')
//     // console.log(columns)
//     // add board

//   }
//   return board
// }

// export const updateBoard = (items: IBoardItem[], board: IBoard): IBoard => {
//   console.log(`update records for ${'board'}`)
//   // ..update board
//   return board
// }
