import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SOURCE_CONNECTION, DESTINATION_CONNECTION } from './providers.interface';

const TEST_DB = 'test'
const JOB_DB = 'job-db'

const localhString = (db) => `mongodb://localhost/${db}`
const localhStringAuth = (db) => `mongodb://jobdb-test:jobdb-test@localhost/${db}?authSource=admin`
// https://docs.docker.com/docker-for-mac/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host
// https://stackoverflow.com/questions/31324981/how-to-access-host-port-from-docker-container (older versions)
// https://stackoverflow.com/questions/24319662/from-inside-of-a-docker-container-how-do-i-connect-to-the-localhost-of-the-mach
const localhStringDock = (db) => `mongodb://host.docker.internal/${db}`

const dockerString = (db) => `mongodb://mongo/${db}`
const dockerStringAuth = (db) => `mongodb://jobdb-test:jobdb-test@mongo/${db}?authSource=admin`

const isDocker = process.env.DOCKER == '1'

// localhost to docker
// const sourceString = isDocker
//   ? localhStringDock(JOB_DB)
//   : dockerStringAuth(TEST_DB)

// const destinationString = isDocker
//   ? dockerStringAuth(TEST_DB)
//   : localhString(TEST_DB)

const sourceString = localhString(JOB_DB)
const destinationString = localhString(TEST_DB)

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
