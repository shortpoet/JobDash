import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Contact } from './interfaces/contact.interface';
import { CreateContactDTO } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(@InjectModel('Contact') private readonly contactModel: Model<Contact>) { }
  // fetch all contacts
  async getAllContact(): Promise<Contact[]> {
    const contacts = await this.contactModel.find().exec();
    return contacts;
  }
  // Get a single contact
  async getContact(contactID): Promise<Contact> {
    const contact = await this.contactModel.findById(contactID).exec();
    return contact;
  }
  // post a single contact
  async addContact(createContactDTO: CreateContactDTO): Promise<Contact> {
    const newContact = await this.contactModel(createContactDTO);
    return newContact.save();
  }
  // Edit contact details
  async updateContact(contactID, createContactDTO: CreateContactDTO): Promise<Contact> {
    const updatedContact = await this.contactModel
      .findByIdAndUpdate(contactID, createContactDTO, { new: true });
    return updatedContact;
  }
  // Delete a contact
  async deleteContact(contactID): Promise<any> {
    const deletedContact = await this.contactModel.findByIdAndRemove(contactID);
    return deletedContact;
  }
}