import { NestFactory } from '@nestjs/core';
import { AppModule } from './producer/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
  console.log('Application is running on: http://localhost:4000');
}
bootstrap();
