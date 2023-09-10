import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { TransformInterceptor } from './transform/transform.interceptor';
import { AllExceptionsFilter } from './all-exceptions/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // format request
  app.useGlobalInterceptors(new TransformInterceptor());

  // validate query
  app.useGlobalPipes(new ValidationPipe());

  // filter expection
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3018);
}
bootstrap();
