import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/message/schemas/message.schema';
import { MessageRetrieverService } from './message.service';
import { SOURCE_CONNECTION } from 'src/archiver/providers/providers.interface';
export const MESSAGE = 'Message'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }], SOURCE_CONNECTION)
  ],
  providers: [MessageRetrieverService],
  exports: [MessageRetrieverService],
})
export class MessageSourceModule {}
