import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/message/interfaces/message.interface';
import { CreateMessageDTO } from './create-message.dto';

@Injectable()
export class MessageRetrieverService {
  constructor(@InjectModel('Message') private readonly messageSource: Model<Message>) { }
  async getAllMessage(): Promise<Message[]> {
    const response: Message[] = await this.messageSource.find().exec();
    const messages = response.map(message => new CreateMessageDTO(message));
    return messages;
  }
}
@Injectable()
export class MessageArchiverService {
  constructor(@InjectModel('Message') private readonly messageDestination: Model<Message>) { }
  create(messages): Array<Promise<Message>> {
    return messages.map(async (message: Message) => {
      return await this.messageDestination
        .findOne({ _id: message._id })
        .exec()
        .then(async dbMessage => {
          // We check if a message already exists.
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
