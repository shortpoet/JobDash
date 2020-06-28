// ./src/message/schemas/message.schema.ts
import * as mongoose from 'mongoose';
import { ContactSchema } from 'src/contact/schemas/contact.schema';
// debug

export const MessageSchema = new mongoose.Schema({
  _id: String,
  itemId: String,
  subject: String,
  body: String,
  category: String,
  contact: [ContactSchema],
  created: {
    type: Date,
    default: Date.now
  },
  edited: {
    type: Date,
    default: Date.now
  },
  editable: Boolean,
  locked: Boolean
})
