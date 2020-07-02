// ./src/contact/interfaces/contact.interface.ts
import { Document } from 'mongoose';

export interface Contact extends Document {
  readonly _id: string;
  readonly itemId: string;
  readonly name: string;
  readonly company: string;
  readonly email: string;
  readonly website: string;
  readonly location: string;
  readonly position: string;
  readonly skills: string;
  readonly compensation: string;  
  readonly created: Date;
  readonly edited: Date;
  readonly editable: Boolean;
  readonly locked: Boolean;
}