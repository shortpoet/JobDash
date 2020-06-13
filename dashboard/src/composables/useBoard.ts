import { IBoardColumn } from "../interfaces/board/board.column.interface"
import { IBoardItem } from "../interfaces/board/board.item.interface"
import { IBoard } from "../interfaces/board/board.interface"
import { useStorage } from './useStorage'
import { BoardStore } from "../store/board.store"
import { ref } from "vue"

const storage = useStorage()
const BOARD = 'board'

const initItems = (items: any[], idSymbol: string): IBoardItem[] => {
  return <IBoardItem[]> items.map((item, i) => initItem(item, idSymbol, i))
}

const initItem = (item: any, idSymbol: string, indexOrder: number): IBoardItem => {
  return {
    id: indexOrder,
    order: indexOrder,
    itemId: item[idSymbol],
    category: item.category
  }
}



export default async function useBoard(store: BoardStore, items: any[], idSymbol: string) {
  console.log('use board')
  
  const board = ref<IBoard>()

  const boardItems: IBoardItem[] = initItems(items, idSymbol)

  const onUpdateBoard = async () => {
    console.log('use board - update') 
    // const newBoard = await updateBoard(items, board)
  }


  return {
    board,
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
