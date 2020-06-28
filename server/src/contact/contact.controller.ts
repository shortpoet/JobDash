// ./src/contact/contact.controller.ts

import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDTO } from './dto/create-contact.dto';
import { query } from 'express';

@Controller('contact')
export class ContactController {
    constructor(private contactService: ContactService) { }

    // add a contact
    @Post('/create')
    async addContact(@Res() res, @Body() createContactDTO: CreateContactDTO) {
        // console.log(createContactDTO.locked)
        const contact = await this.contactService.addContact(createContactDTO);
        // console.log(contact.locked)
        return res.status(HttpStatus.OK).json({
            dtoLog: "Contact has been created successfully",
            contact
        })
    }

    // Retrieve contacts list
    @Get('contacts')
    async getAllContact(@Res() res) {
        const contacts = await this.contactService.getAllContact();
        return res.status(HttpStatus.OK).json(contacts);
    }

    // Fetch a particular contact using ID
    @Get('contact/:contact_id')
    async getContact(@Res() res, @Param('contact_id') contactID) {
        // console.log(contactID)
        const contact = await this.contactService.getContact(contactID);
        // console.log(contactID)
        if (!contact) throw new NotFoundException('Contact does not exist!');
        return res.status(HttpStatus.OK).json(contact);
    }

    // Update a contact's details
    @Put('/update')
    async updateContact(@Res() res, @Query('contact_id') contact_id, @Body() createContactDTO: CreateContactDTO) {
        console.log(createContactDTO._id)
        const contact = await this.contactService.updateContact(contact_id, createContactDTO);
        // console.log(contact.id)
        if (!contact) throw new NotFoundException('Contact does not exist!');
        return res.status(HttpStatus.OK).json({
            dtoLog: 'Contact has been successfully updated',
            contact
        });
    }

    // Delete a contact
    @Delete('/delete')
    async deleteContact(@Res() res, @Query('contact_id') contact_id) {
        const contact = await this.contactService.deleteContact(contact_id);
        if (!contact) throw new NotFoundException('Contact does not exist');
        return res.status(HttpStatus.OK).json({
            dtoLog: 'Contact has been deleted',
            contact
        })
    }
}