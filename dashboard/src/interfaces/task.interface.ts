
import { Contact } from './contact.interface';
import { Moment } from "moment";

export interface Task {
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