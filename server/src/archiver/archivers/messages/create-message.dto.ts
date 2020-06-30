
// ./src/message/dto/create-message.dto.ts

import { Contact } from "src/contact/interfaces/contact.interface"
import { Message } from "src/message/interfaces/message.interface"

export class CreateMessageDTO {
  constructor(message: Message) {
    this._id = message._id
    this.itemId = message.itemId
    this.subject = message.subject
    this.body = message.body
    this.category = message.category
    this.created = message.created
    this.contact = message.contact
    this.edited = message.edited
    this.editable = message.editable
    this.locked = message.locked
  }

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