import { IBoardColumn } from "../interfaces/board/board.column.interface"
import { IBoardItem } from "../interfaces/board/board.item.interface"
import { IBoard } from "../interfaces/board/board.interface"
import { useStorage } from './useStorage'
import { BoardStore } from "../store/board.store"
import { ref } from "vue"
import { loadRecords } from './../utils'

const storage = useStorage()
const BOARD = 'board'

const initItems = (items: any[], idSymbol: string): IBoardItem[] => {
  const itemsOut: IBoardItem[] = [] as IBoardItem[]
  let counter
  const categories = [...new Set(items.map(item => item.category))]
  categories.forEach((category, categoryIndex) => {
    counter = 0
    items.forEach((item, itemIndex) => {
      // console.log(itemIndex)
      if (item.category == category) {
        // console.log(item)
        itemsOut.push(initItem(item, idSymbol, counter))
        counter++
      }
    })
  })
  return itemsOut
}

const initItem = (item: any, idSymbol: string, indexOrder: number): IBoardItem => {
  return {
    category: item.category,
    order: indexOrder,
    itemId: item[idSymbol]
  }
}

const parseBoard = (items: IBoardItem[]): IBoard => {
  // console.log('begin parse board')
  let counter = 0
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
      counter++
    } else {
      const column: Record<string, IBoardColumn> = {} as Record<string, IBoardColumn>
      column[item.category] = <IBoardColumn>{
        category: item.category,
        order: counter,
        items: {} as Record<number, IBoardItem>
      }
      column[item.category].items[item.itemId] = item
      Object.assign(board['columns'], column)
      counter = 0
    }
  })
  // console.log('end parse board')
  // console.log(board)
  return board
}

const orderItems = (itemMap: Record<number, IBoardItem>): IBoardItem[] => {
  console.log('begin order items')
  const items: IBoardItem[] = []
  Object.entries(itemMap).forEach((entry, index) => {
    if (entry[1].order == index) {
      items.push(<IBoardItem>{
        itemId: entry[1].itemId,
        order: entry[1].order,
        category: entry[1].category        
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
    const order = value.order
    const items = value.items
    const column: IBoardColumn = {
      category: category,
      order: order,
      items: orderItems(items)
    }
    if (order == index) {
      columns.push(column)
    }
  })
  return columns
}

export default async function useBoard(boardStore: BoardStore, items: any[], idSymbol: string) {
  console.log('use board')
  
  const storedBoard = ref<IBoard>()

  const boardItems: IBoardItem[] = initItems(items, idSymbol)

  const storedItems = await loadRecords(boardStore, BOARD, boardItems)

  // console.log('stored items')
  // console.log(storedItems)

  storedBoard.value = parseBoard(storedItems)

  // console.log('parsed board')
  // console.log(storedBoard.value)

  const columnMap = ref<Record<string, IBoardColumn>>()

  columnMap.value = storedBoard.value.columns

  // console.log('column map')
  // console.log(columnMap.value)

  const columns = ref<IBoardColumn[]>()

  columns.value = orderColumns(columnMap.value)

  // console.log('columns')
  // console.log(columns.value)



  const onUpdateBoard = async () => {
    console.log('use board - update') 
    // const newBoard = await updateBoard(items, board)
  }


  return {
    storedBoard,
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
