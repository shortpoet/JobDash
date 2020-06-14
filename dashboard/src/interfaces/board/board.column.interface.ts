import { IBoardItem } from "./board.item.interface";

export interface IBoardColumn {
  category: string
  columnOrder: number
  items: IBoardItem[]
}