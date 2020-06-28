import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from './task/task.module';
import { MessageModule } from './message/message.module';

const connString = process.env.DOCKER == '1'
  ? 'mongodb://mongo/job-db'
  : 'mongodb://localhost/job-db'

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
    MessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
