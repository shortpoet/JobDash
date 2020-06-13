import { IBoardItem } from "./board.item.interface";

export interface IBoardColumn {
  category: string
  order: number
  items: Record<number, IBoardItem>
}