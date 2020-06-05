import { Moment } from "moment";

export interface Contact {
  _id: string
  name: string
  company: string
  email: string
  created: Moment
  editable: boolean
}
