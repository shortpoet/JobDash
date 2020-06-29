import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/message/interfaces/message.interface';
import { MESSAGE_SOURCE, MESSAGE_DESTINATION } from './message.module';

@Injectable()
export class MessageArchiverService {
  constructor(
    @InjectModel(MESSAGE_SOURCE) private readonly messageSource: Model<Message>,
    @InjectModel(MESSAGE_DESTINATION) private readonly messageDestination: Model<Message>
  ) { }

  async getAllMessage(): Promise<Message[]> {
    const messages = await this.messageSource.find().exec();
    return messages;
  }

  // fetch all messages
  create(messages): Array<Promise<Message>> {
    return messages.map(async (message: Message) => {
      return await this.messageDestination
        .findOne({ _id: message._id })
        .exec()
        .then(async dbMessage => {
          // We check if a language already exists.
          // If it does don't create a new one.
          if (dbMessage) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.messageDestination.create(message),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
