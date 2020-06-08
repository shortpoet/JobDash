import { Moment } from "moment";
import { TableItem } from "./table.item.interface";

export interface Contact extends TableItem {
  _id: string
  name: string
  company: string
  email: string
  created: Moment
  edited: Moment
  editable: boolean
  locked: boolean
}
