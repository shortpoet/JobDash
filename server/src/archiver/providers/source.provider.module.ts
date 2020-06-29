import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactModule } from 'src/contact/contact.module';
import { TaskModule } from 'src/task/task.module';
import { MessageModule } from 'src/message/message.module';
import { SOURCE_CONNECTION } from './providers.interface';

const connString = process.env.DOCKER == '1'
  ? 'mongodb://mongo/job-db'
  : 'mongodb://localhost/job-db'

@Module({
  imports: [
    MongooseModule.forRoot(
      connString,
      {
        useNewUrlParser: true,
        connectionName: SOURCE_CONNECTION
      }
    ),
    ContactModule,
    TaskModule,
    MessageModule,
  ],
})
export class SourceProviderModule {}
