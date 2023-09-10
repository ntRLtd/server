import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RulesetsController } from './rulesets/rulesets.controller';

@Module({
  imports: [],
  controllers: [AppController, RulesetsController],
  providers: [AppService],
})
export class AppModule {}
