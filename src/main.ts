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
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // filter expection
  app.useGlobalFilters(new AllExceptionsFilter());

  // enable cors in localhost
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(3018);
}
bootstrap();
