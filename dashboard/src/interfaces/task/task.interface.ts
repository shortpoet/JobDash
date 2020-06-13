
import { Contact } from '../contact/contact.interface';
import { Moment } from "moment";
import { TableItem } from '../common/table.item.interface';

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