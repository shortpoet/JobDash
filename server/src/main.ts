import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  process.env.DOCKER == '1'
    ? await app.listen(3000, '0.0.0.0')
    : await app.listen(3000)
}
bootstrap();
