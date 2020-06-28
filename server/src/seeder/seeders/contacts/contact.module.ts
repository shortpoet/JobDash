import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactSchema } from 'src/contact/schemas/contact.schema';
import { ContactSeederService } from './contact.service';

const connString = process.env.DOCKER == '1'
  ? 'mongodb://mongo/job-db'
  : 'mongodb://localhost/job-db'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Contact', schema: ContactSchema }])
  ],
  providers: [ContactSeederService],
  exports: [ContactSeederService],
})
export class ContactSeederModule {}
