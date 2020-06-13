import { Moment } from "moment";
import { IBoardColumn } from "./board.column.interface";

export interface Board {
  _id: string
  name: string
  columns: IBoardColumn[]
  created: Moment
  edited: Moment
}
