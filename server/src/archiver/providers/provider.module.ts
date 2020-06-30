import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SOURCE_CONNECTION, DESTINATION_CONNECTION } from './providers.interface';

const sourceString = process.env.DOCKER == '1'
  ? 'mongodb://mongo/job-db'
  : 'mongodb://localhost/job-db'

const destinationString = process.env.DOCKER == '1'
  ? 'mongodb://mongo/job-db'
  : 'mongodb://localhost/test'

@Module({
  imports: [
    MongooseModule.forRoot(
      sourceString,
      {
        connectionName: SOURCE_CONNECTION
      }
    ),
    MongooseModule.forRoot(
      destinationString,
      {
        connectionName: DESTINATION_CONNECTION
      }
    )
  ],
})
export class ArchiverProviderModule {}
