// ./src/contact/schemas/customer.schema.ts
import * as mongoose from 'mongoose';
import moment from 'moment';

export const ContactSchema = new mongoose.Schema({
  _id: String,
  name: String,
  company: String,
  email: String,
  created: {
    type: Date,
    default: Date.now
  },
  edited: {
    type: Date,
    default: Date.now
  },
  editable: Boolean
    
    // // https://github.com/Automattic/mongoose/issues/5110#issuecomment-289637431
    // created_at: moment().valueOf()
})