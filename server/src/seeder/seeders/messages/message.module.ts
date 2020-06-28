import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/message/schemas/message.schema';
import { MessageSeederService } from './message.service';

const connString = process.env.DOCKER == '1'
  ? 'mongodb://mongo/job-db'
  : 'mongodb://localhost/job-db'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }])
  ],
  providers: [MessageSeederService],
  exports: [MessageSeederService],
})
export class MessageSeederModule {}
