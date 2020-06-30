import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from 'src/contact/interfaces/contact.interface';
import { SOURCE_CONNECTION } from 'src/archiver/providers/providers.interface';
import { Connection } from 'mongoose';
import { CreateContactDTO } from './create-contact.dto';

@Injectable()
export class ContactRetrieverService {
  constructor(
    @InjectModel('Contact') private readonly contactSource: Model<Contact>,
    // @InjectConnection(SOURCE_CONNECTION) private readonly connection: Connection
  ) { }
  async getAllContact(): Promise<Contact[]> {
    // console.log('get all contacts')
    // console.log(this.connection)
    try {
      const response: Contact[] = await this.contactSource.find().exec();
      const contacts = response.map(contact => new CreateContactDTO(contact));
      return contacts;

    } catch (e) {
      console.log(e)
    }
  }
}
@Injectable()
export class ContactArchiverService {
  constructor(
    private readonly logger: Logger,
    @InjectModel('Contact') private readonly contactDestination: Model<Contact>
  ) { }
  create(contacts): Array<Promise<Contact>> {
    this.logger.debug('contact archiver service 1')
    return contacts.map(async (contact: Contact) => {
      try {
        return await this.contactDestination
          .findOne({ _id: contact._id })
          .exec()
          .then(async (dbContact, err: Error) => {
            // We check if a contact already exists.
            // If it does don't create a new one.
            if (dbContact) {
              return Promise.resolve(null);
            }
            try {
              return Promise.resolve(
                await this.contactDestination.create(contact)
              );
            } catch (e) {
              this.logger.error(e)
            }
          })
          .catch(error => Promise.reject(error));
      }
      catch (e) {
        this.logger.error(e)
      }
    });
  }
}
