import { Moment } from "moment";
import { ITaskColumn } from "./task.column.interface";

export interface Board {
  _id: string
  name: string
  columns: ITaskColumn[]
  created: Moment
  edited: Moment
}
