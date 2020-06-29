import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactSchema } from 'src/contact/schemas/contact.schema';
import { ContactSeederService } from './contact.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Contact', schema: ContactSchema }])
  ],
  providers: [ContactSeederService],
  exports: [ContactSeederService],
})
export class ContactSeederModule {}
