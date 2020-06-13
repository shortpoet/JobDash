import { IBoardItem } from "./board.item.interface";

export interface IBoardColumn {
  id: number
  order: number
  items: IBoardItem
  category: string
}