import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/message/interfaces/message.interface';
import { messages } from './data';

@Injectable()
export class MessageSeederService {
  constructor(@InjectModel('Message') private readonly messageModel: Model<Message>) { }
  // fetch all messages
  create(): Array<Promise<Message>> {
    return messages.map(async (message: Message) => {
      return await this.messageModel
        .findOne({ _id: message._id })
        .exec()
        .then(async dbMessage => {
          // We check if a language already exists.
          // If it does don't create a new one.
          if (dbMessage) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.messageModel.create(message),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
