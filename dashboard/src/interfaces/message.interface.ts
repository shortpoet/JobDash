import { Moment } from "moment";
import { TableItem } from "./table.item.interface";
import { Contact } from "./contact.interface";

export interface Message extends TableItem {
  _id: string
  subject: string
  body: string
  category: string
  contact: Contact
  created: Moment
  edited: Moment
  editable: boolean
  locked: boolean
}
