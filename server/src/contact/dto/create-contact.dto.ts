
// ./src/contacts/dto/create-contact.dto.ts

export class CreateContactDTO {
  readonly id: number;
  readonly name: string;
  readonly company: string;
  readonly email: string;
  readonly created: Date;
}