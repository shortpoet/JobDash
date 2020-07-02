
// ./src/contacts/dto/create-contact.dto.ts

import { Contact } from "src/contact/interfaces/contact.interface";

export class CreateContactDTO {
  constructor(contact: Contact) {
    this._id = contact._id
    this.itemId = contact.itemId
    this.name = contact.name
    this.company = contact.company
    this.email = contact.email
    this.website = contact.website
    this.location = contact.location
    this.position = contact.position
    this.skills = contact.skills
    this.compensation = contact.compensation
    this.created = contact.created
    this.edited = contact.edited
    this.editable = contact.editable
    this.locked = contact.locked
  }
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
