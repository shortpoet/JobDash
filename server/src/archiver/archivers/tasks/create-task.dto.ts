
// ./src/tasks/dto/create-task.dto.ts
import { Contact } from "src/contact/interfaces/contact.interface";
import { Task } from "src/task/interfaces/task.interface";

export class CreateTaskDTO {
  constructor(task: Task) {
    this._id = task._id
    this.itemId = task.itemId
    this.name = task.name
    this.description = task.description
    this.category = task.category
    this.created = task.created
    this.contact = task.contact
    this.edited = task.edited
    this.editable = task.editable
    this.locked = task.locked
  }

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