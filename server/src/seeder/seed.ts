import { NestFactory } from "@nestjs/core";
import { SeederModule } from "./seeders/seeder.module";
import { Logger } from "@nestjs/common";
import { Seeder } from "./seeders/seeder";
// https://medium.com/the-crowdlinker-chronicle/seeding-databases-using-nestjs-cd6634e8efc5
async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then(appContext => {
      const logger = appContext.get(Logger);
      const seeder = appContext.get(Seeder);
      seeder
        .seed()
        .then(() => {
          logger.debug('Seeding complete!');
        })
        .catch(error => {
          logger.error('Seeding failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch(error => {
      throw error;
    });
}
bootstrap();