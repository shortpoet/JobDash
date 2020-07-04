import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from './task/task.module';
import { MessageModule } from './message/message.module';

const JOB_DB = 'job-db'
const dockerStringAuth = (db) => `mongodb://jobdb-test:jobdb-test@mongo/${db}?authSource=admin`

const connString = process.env.DOCKER == '1'
  ? dockerStringAuth(JOB_DB)
  : 'mongodb://localhost/job-db'
console.log(connString)
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
