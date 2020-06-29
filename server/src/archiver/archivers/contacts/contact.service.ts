import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from 'src/contact/interfaces/contact.interface';
import { CONTACT_SOURCE, CONTACT_DESTINATION } from './contact.module';

@Injectable()
export class ContactArchiverService {
  constructor(
    @InjectModel(CONTACT_SOURCE) private readonly contactSource: Model<Contact>,
    @InjectModel(CONTACT_DESTINATION) private readonly contactDestination: Model<Contact>
  ) { }

  async getAllContact(): Promise<Contact[]> {
    const contacts = await this.contactSource.find().exec();
    return contacts;
  }

  // fetch all messages
  create(contacts): Array<Promise<Contact>> {
    return contacts.map(async (contact: Contact) => {
      return await this.contactDestination
        .findOne({ _id: contact._id })
        .exec()
        .then(async dbContact => {
          // We check if a language already exists.
          // If it does don't create a new one.
          if (dbContact) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.contactDestination.create(contact),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
