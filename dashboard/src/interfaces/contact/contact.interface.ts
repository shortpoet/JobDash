import { Moment } from "moment";
import { TableItem } from "../common/table.item.interface";

export interface Contact extends TableItem {
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
