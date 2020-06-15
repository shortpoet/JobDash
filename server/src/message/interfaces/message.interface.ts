// ./src/message/interfaces/message.interface.ts
import { Document } from 'mongoose';
import { Contact } from './../../../src/contact/interfaces/contact.interface';

export interface Message extends Document {
    readonly _id: string;
    readonly itemId: string;
    readonly subject: string
    readonly body: string
    readonly category: string
    readonly contact: Contact
    readonly created: Date
    readonly edited: Date
    readonly editable: boolean
    readonly locked: boolean
}