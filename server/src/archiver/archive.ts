import { NestFactory } from "@nestjs/core";
import { ArchiverModule } from "./archivers/archiver.module";
import { Logger } from "@nestjs/common";
import { Archiver } from "./archivers/archiver";

async function bootstrap() {
  NestFactory.createApplicationContext(ArchiverModule)
    .then(appContext => {
      const logger = appContext.get(Logger);
      const archiver = appContext.get(Archiver);
      archiver
        .archive()
        .then(() => {
          logger.debug('Archiving complete!');
        })
        .catch(error => {
          logger.error('Archiving failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch(error => {
      throw error;
    });
}
bootstrap();