import { Moment } from "moment";
import { TableItem } from "../table/table.item.interface";
import { IContact } from "../contact/contact.interface";

export interface IMessage extends TableItem {
  _id: string
  itemId: string
  subject: string
  body: string
  category: string
  contact: IContact
  created: Moment
  edited: Moment
  editable: boolean
  locked: boolean
}

// export abstract class 