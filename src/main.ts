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

  // filter exception
  app.useGlobalFilters(new AllExceptionsFilter());

  // enable cors in localhost
  app.enableCors({
    origin: (origin, callback) => {
      // is localhost debug
      if (origin.includes('localhost')) {
        callback(null, true);
        return;
      }

      // is a vercel domain and path include "-ntrltd"
      const ntrPagePrefixes = [
        'ntrwiki', // online page
        '-ntrltd', // test branch
      ];
      if (
        origin.includes('vercel.app') &&
        ntrPagePrefixes.some((prefix) => origin.includes(prefix))
      ) {
        callback(null, true);
        return;
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(3018);
}
bootstrap();
