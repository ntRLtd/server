import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestMiddleware.name);

  use(req: Request, res: Response, next) {
    this.logger.log(`[${req.method}] ${req.originalUrl}`);
    next();
  }
}
