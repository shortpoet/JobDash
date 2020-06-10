// ./src/task/schemas/customer.schema.ts
import * as mongoose from 'mongoose';
import moment from 'moment';
import { ContactController } from 'src/contact/contact.controller';
import { Contact } from 'src/contact/interfaces/contact.interface';
import { ContactSchema } from 'src/contact/schemas/contact.schema';
export const TaskSchema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  category: String,
  // doesn't work here
  // broke on insert of new task
  // [Nest] 22008   - 06/07/2020, 7:53:06 PM   [ExceptionsHandler] Task validation failed: contact: Cast to ObjectId failed for value "{contact}"
  // https://stackoverflow.com/questions/39596625/nested-objects-in-mongoose-schemas
  // contact: {
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: 'Contact'
  // },
  // work
  // https://stackoverflow.com/a/34280778/12658653
  contact: [ContactSchema],
  // contact: ContactSchema,
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