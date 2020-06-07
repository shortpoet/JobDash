// ./src/task/schemas/customer.schema.ts
import * as mongoose from 'mongoose';
import moment from 'moment';
import { ContactController } from 'src/contact/contact.controller';
import { Contact } from 'src/contact/interfaces/contact.interface';

export const TaskSchema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  category: String,
  contact: {type: mongoose.Schema.Types.ObjectId, ref: 'Contact'},
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
    
    // // https://github.com/Automattic/mongoose/issues/5110#issuecomment-289637431
    // created_at: moment().valueOf()
})