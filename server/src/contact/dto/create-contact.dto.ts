
// ./src/contacts/dto/create-contact.dto.ts

export class CreateContactDTO {
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