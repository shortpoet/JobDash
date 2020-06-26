
import { IContact } from '../contact/contact.interface';
import { Moment } from "moment";
import { ITableItem } from '../table/table.item.interface';

export interface ITask extends ITableItem {
  _id: string;
  itemId: string;
  name: string;
  description: string;
  category: string;
  contact: IContact;
  created: Moment;
  edited: Moment;
  editable: boolean;
  locked: boolean;
}