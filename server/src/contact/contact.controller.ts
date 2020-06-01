// ./src/contact/contact.controller.ts

import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDTO } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
    constructor(private contactService: ContactService) { }

    // add a contact
    @Post('/create')
    async addContact(@Res() res, @Body() createContactDTO: CreateContactDTO) {
        const contact = await this.contactService.addContact(createContactDTO);
        return res.status(HttpStatus.OK).json({
            message: "Contact has been created successfully",
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
    @Get('contact/:contactID')
    async getContact(@Res() res, @Param('contactID') contactID) {
        const contact = await this.contactService.getContact(contactID);
        if (!contact) throw new NotFoundException('Contact does not exist!');
        return res.status(HttpStatus.OK).json(contact);
    }

    // Update a contact's details
    @Put('/update')
    async updateContact(@Res() res, @Query('contactID') contactID, @Body() createContactDTO: CreateContactDTO) {
        const contact = await this.contactService.updateContact(contactID, createContactDTO);
        if (!contact) throw new NotFoundException('Contact does not exist!');
        return res.status(HttpStatus.OK).json({
            message: 'Contact has been successfully updated',
            contact
        });
    }

    // Delete a contact
    @Delete('/delete')
    async deleteContact(@Res() res, @Query('contactID') contactID) {
        const contact = await this.contactService.deleteContact(contactID);
        if (!contact) throw new NotFoundException('Contact does not exist');
        return res.status(HttpStatus.OK).json({
            message: 'Contact has been deleted',
            contact
        })
    }
}