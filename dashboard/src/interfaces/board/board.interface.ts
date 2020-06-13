import { IBoardColumn } from "./board.column.interface";

export interface IBoard {
  id: number
  name: string
  columns: IBoardColumn[]
}
