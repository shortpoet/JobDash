import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/message/schemas/message.schema';
import { MessageArchiverService } from './message.service';
import { DESTINATION_CONNECTION, SOURCE_CONNECTION } from 'src/archiver/providers/providers.interface';
export const MESSAGE_SOURCE = 'MessageSource'
export const MESSAGE_DESTINATION = 'MessageDestination'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MESSAGE_SOURCE, schema: MessageSchema }], SOURCE_CONNECTION)
  ],
  providers: [MessageArchiverService],
  exports: [MessageArchiverService],
})
export class MessageSourceModule {}

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MESSAGE_DESTINATION, schema: MessageSchema }], DESTINATION_CONNECTION)
  ],
  providers: [MessageArchiverService],
  exports: [MessageArchiverService],
})
export class MessageDestinationModule {}
