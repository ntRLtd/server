import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const message = exception.getResponse();

    if (message instanceof Error) {
      this.logger.error(message.stack);
    } else {
      this.logger.error(message);
    }

    /**
     * WARNING
     * If you are using @nestjs/platform-fastify you can use response.send() instead of response.json(). Don't forget to import the correct types from fastify.
     */
    response.status(status).send({
      statusCode: status,
      message:
        typeof message === 'string'
          ? message
          : (message as Error).message || 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
