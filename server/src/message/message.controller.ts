// ./src/message/message.controller.ts

import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDTO } from './dto/create-message.dto';
import { query } from 'express';
var mongoose = require('mongoose')

@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService) { }

    // add a message
    @Post('/create')
    async addMessage(@Res() res, @Body() createMessageDTO: CreateMessageDTO) {
        console.log('create message')
        const message = await this.messageService.addMessage(createMessageDTO);
        return res.status(HttpStatus.OK).json({
            dtoLog: "Message has been created successfully",
            message
        })
    }

    // Retrieve messages list
    @Get('messages')
    async getAllMessage(@Res() res) {
        const messages = await this.messageService.getAllMessage();
        // console.log('logging messages')
        // console.log(messages)
        // messages.forEach(message => {
        //     console.log(message)
        //     console.log(message.contact)
        // })
        return res.status(HttpStatus.OK).json(messages);
    }

    // Fetch a particular message using ID
    @Get('message/:messageID')
    async getMessage(@Res() res, @Param('message_id') messageID) {
        const message = await this.messageService.getMessage(messageID);
        if (!message) throw new NotFoundException('Message does not exist!');
        return res.status(HttpStatus.OK).json(message);
    }

    // Update a message's details
    @Put('/update')
    async updateMessage(@Res() res, @Query('message_id') message_id, @Body() createMessageDTO: CreateMessageDTO) {
        console.log(createMessageDTO._id)
        const message = await this.messageService.updateMessage(message_id, createMessageDTO);
        // console.log(message.id)
        if (!message) throw new NotFoundException('Message does not exist!');
        return res.status(HttpStatus.OK).json({
            dtoLog: 'Message has been successfully updated',
            message
        });
    }

    // Delete a message
    @Delete('/delete')
    async deleteMessage(@Res() res, @Query('message_id') message_id) {
        const message = await this.messageService.deleteMessage(message_id);
        if (!message) throw new NotFoundException('Message does not exist');
        return res.status(HttpStatus.OK).json({
            dtoLog: 'Message has been deleted',
            message
        })
    }
}