import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost/job-db',
      {
        useNewUrlParser: true
      }
    ),
    ContactModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}