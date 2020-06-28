
// ./src/message/dto/create-message.dto.ts

import { Contact } from "src/contact/interfaces/contact.interface"

export class CreateMessageDTO {
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