import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { fastifyStatic } from '@fastify/static';

import { AppModule } from './app.module';
import { TransformInterceptor } from './transform/transform.interceptor';
import { AllExceptionsFilter } from './all-exceptions/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // format request
  app.useGlobalInterceptors(new TransformInterceptor());

  // validate query
  app.useGlobalPipes(new ValidationPipe());

  // filter expection
  app.useGlobalFilters(new AllExceptionsFilter());

  // server static contents
  app.register(fastifyStatic, {
    root: join(__dirname, '..', 'assets'),
    prefix: '/assets/', // optional: default '/'
  });

  await app.listen(3018);
}
bootstrap();
