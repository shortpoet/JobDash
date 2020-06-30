import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactSchema } from 'src/contact/schemas/contact.schema';
import { ContactRetrieverService } from './contact.service';
import { SOURCE_CONNECTION } from 'src/archiver/providers/providers.interface';

export const CONTACT = 'Contact'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Contact', schema: ContactSchema }], SOURCE_CONNECTION),
    
  ],
  providers: [ContactRetrieverService],
  exports: [ContactRetrieverService],
})
export class ContactSourceModule {}
