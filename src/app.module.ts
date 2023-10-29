import { NestModule, Module, MiddlewareConsumer } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RulesetsController } from './rulesets/rulesets.controller';
import { RequestMiddleware } from './request/request.middleware';
import { ASSETS_PATH } from './constants';
import { AssetsService } from './assets/assets.service';
import { RulesetsService } from './rulesets/rulesets.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: ASSETS_PATH,
    }),
  ],
  controllers: [AppController, RulesetsController],
  providers: [AppService, AssetsService, RulesetsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
