
// ./src/tasks/dto/create-task.dto.ts
import { Contact } from "src/contact/interfaces/contact.interface";

export class CreateTaskDTO {
  readonly _id: string;
  readonly itemId: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly contact: Contact;
  readonly created: Date;
  readonly edited: Date;
  readonly editable: Boolean;
  readonly locked: Boolean;
}