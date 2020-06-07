
import { Contact } from './contact.interface';

export interface Task {
    _id: string;
    name: string;
    description: string;
    category: string;
    contact: Contact;
    created: Date;
    edited: Date;
    editable: Boolean;
    locked: Boolean;
}