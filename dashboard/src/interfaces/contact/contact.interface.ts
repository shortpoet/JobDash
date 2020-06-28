import { Moment } from "moment";
import { ITableItem } from "../table/table.item.interface";

export interface IContact extends ITableItem {
  _id: string
  itemId: string
  name: string
  company: string
  email: string
  created: Moment
  edited: Moment
  editable: boolean
  locked: boolean
}
