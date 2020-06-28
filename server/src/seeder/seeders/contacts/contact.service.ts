import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from 'src/contact/interfaces/contact.interface';
import { contacts } from './data';

@Injectable()
export class ContactSeederService {
  constructor(@InjectModel('Contact') private readonly contactModel: Model<Contact>) { }
  // fetch all messages
  create(): Array<Promise<Contact>> {
    return contacts.map(async (contact: Contact) => {
      return await this.contactModel
        .findOne({ _id: contact._id })
        .exec()
        .then(async dbContact => {
          // We check if a language already exists.
          // If it does don't create a new one.
          if (dbContact) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.contactModel.create(contact),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
