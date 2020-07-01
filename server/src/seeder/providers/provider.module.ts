import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactModule } from 'src/contact/contact.module';
import { TaskModule } from 'src/task/task.module';
import { MessageModule } from 'src/message/message.module';

const connString = process.env.DOCKER == '1'
  ? 'mongodb://jobdb-test:jobdb-test@mongo/job-db?authSource=admin'
  : 'mongodb://localhost/test'
@Module({
  imports: [
    MongooseModule.forRoot(
      connString,
      {
        useNewUrlParser: true
      }
    )
  ],
})
export class SeederProviderModule {}
