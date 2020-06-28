import { Moment } from "moment";
import { TableItem } from "../table/table.item.interface";
import { IContact } from "../contact/contact.interface";
import moment from "moment";

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

export abstract class BaseMessage implements IMessage {
  _id: string;
  itemId: string;
  subject: string;
  body: string;
  category: string;
  contact: IContact;
  created: Moment;
  edited: Moment;
  editable: boolean;
  locked: boolean;
  constructor(contact: IContact) {
    this._id = '-1'
    this.itemId = '-1'
    this.subject = ''
    this.body = ''
    this.category = ''
    this.contact = contact
    this.created = moment()
    this.edited = moment()
    this.editable = false
    this.locked = true
  }
}

export class Message extends BaseMessage {
  constructor(contact: IContact) {
    super(contact);
  }
}