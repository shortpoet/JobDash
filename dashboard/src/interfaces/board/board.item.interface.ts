import { IBoardable } from "./boardable.interface";

export interface IBoardItem extends IBoardable{
  category: string
  order: number
  itemId: number
}