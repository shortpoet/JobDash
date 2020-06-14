import { IBoardable } from "./boardable.interface";

export interface IBoardItem extends IBoardable{
  itemId: number
  category: string
  itemOrder: number
  columnOrder: number
}