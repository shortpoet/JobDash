import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './interfaces/message.interface';
import { CreateMessageDTO } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(@InjectModel('Message') private readonly messageModel: Model<Message>) { }
  // fetch all messages
  async getAllMessage(): Promise<Message[]> {
    const messages = await this.messageModel.find().populate('Contact').exec();
    return messages;
  }
  // Get a single message
  async getMessage(messageID): Promise<Message> {
    const message = await this.messageModel.findById(messageID).populate('Contact').exec();
    return message;
  }
  // post a single message
  async addMessage(createMessageDTO: CreateMessageDTO): Promise<Message> {
    const newMessage = await this.messageModel(createMessageDTO);
    console.log('create from service')
    // console.log(newMessage)
    // const savedMessage = await newMessage.save();
    // console.log('return from service')
    // console.log(savedMessage)
    // return savedMessage;
    return newMessage.save();
  }
  // Edit message details
  async updateMessage(messageID, createMessageDTO: CreateMessageDTO): Promise<Message> {
    const updatedMessage = await this.messageModel
      .findByIdAndUpdate(messageID, createMessageDTO, { new: true });
    return updatedMessage;
  }
  // Delete a message
  async deleteMessage(messageID): Promise<any> {
    const deletedMessage = await this.messageModel.findByIdAndRemove(messageID);
    return deletedMessage;
  }
}