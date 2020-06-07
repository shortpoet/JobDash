
// ./src/contacts/dto/create-contact.dto.ts

export class CreateContactDTO {
  readonly _id: number;
  readonly name: string;
  readonly company: string;
  readonly email: string;
  readonly created: Date;
  readonly edited: Date;
  readonly editable: Boolean;
  readonly locked: Boolean;
}