import { NestModule, Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RulesetsController } from './rulesets/rulesets.controller';
import { RequestMiddleware } from './request/request.middleware';
import { RulesetsService } from './rulesets/rulesets.service';

@Module({
  imports: [],
  controllers: [AppController, RulesetsController],
  providers: [AppService, RulesetsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
