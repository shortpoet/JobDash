import { Moment } from "moment";
import { Contact } from "./contact.interface";

export interface ContactDTO {
  message: string
  contact: Contact
}