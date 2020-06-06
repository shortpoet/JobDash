// ./src/contact/interfaces/contact.interface.ts
import { Document } from 'mongoose';

export interface Contact extends Document {
    readonly _id: string;
    readonly name: string;
    readonly company: string;
    readonly email: string;
    readonly created: Date;
    readonly edited: Date;
    readonly editable: Boolean;
}