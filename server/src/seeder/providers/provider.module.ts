import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactModule } from 'src/contact/contact.module';
import { TaskModule } from 'src/task/task.module';
import { MessageModule } from 'src/message/message.module';

const connString = process.env.DOCKER == '1'
  ? 'mongodb://mongo/job-db'
  : 'mongodb://localhost/test'

@Module({
  imports: [
    MongooseModule.forRoot(
      connString,
      {
        useNewUrlParser: true
      }
    ),
    ContactModule,
    TaskModule,
    MessageModule,
  ],
})
export class SeederProviderModule {}
