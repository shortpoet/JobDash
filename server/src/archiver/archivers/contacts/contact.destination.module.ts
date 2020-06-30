import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactSchema } from 'src/contact/schemas/contact.schema';
import { ContactArchiverService } from './contact.service';
import { DESTINATION_CONNECTION } from 'src/archiver/providers/providers.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Contact', schema: ContactSchema }], DESTINATION_CONNECTION),
  ],
  providers: [ContactArchiverService, Logger],
  exports: [ContactArchiverService],
})
export class ContactDestinationModule {}
