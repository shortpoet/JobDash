
import { Contact } from './contact.interface';
import { Moment } from "moment";
import { TableItem } from './table.item.interface';

export interface Task extends TableItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  contact: Contact;
  created: Moment;
  edited: Moment;
  editable: Boolean;
  locked: Boolean;
}