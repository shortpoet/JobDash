import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/message/schemas/message.schema';
import { MessageArchiverService } from './message.service';
import { DESTINATION_CONNECTION } from 'src/archiver/providers/providers.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }], DESTINATION_CONNECTION)
  ],
  providers: [MessageArchiverService],
  exports: [MessageArchiverService],
})
export class MessageDestinationModule {}
