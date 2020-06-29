import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactSchema } from 'src/contact/schemas/contact.schema';
import { ContactArchiverService } from './contact.service';
import { DESTINATION_CONNECTION, SOURCE_CONNECTION } from 'src/archiver/providers/providers.interface';

export const CONTACT_SOURCE = 'ContactSource'
export const CONTACT_DESTINATION = 'ContactDestination'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CONTACT_SOURCE, schema: ContactSchema }], SOURCE_CONNECTION)
  ],
  providers: [ContactArchiverService],
  exports: [ContactArchiverService],
})
export class ContactSourceModule {}

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CONTACT_DESTINATION, schema: ContactSchema }], DESTINATION_CONNECTION)
  ],
  providers: [ContactArchiverService],
  exports: [ContactArchiverService],
})
export class ContactDestinationModule {}
