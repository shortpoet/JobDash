import { IBoardable } from "./boardable.interface";

export interface IBoardItem extends IBoardable{
  itemId: string
  category: string
  itemOrder: number
  columnOrder: number
  item: object
}