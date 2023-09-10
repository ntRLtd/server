import { Test, TestingModule } from '@nestjs/testing';
import { RulesetsController } from './rulesets.controller';

describe('RulesetsController', () => {
  let controller: RulesetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RulesetsController],
    }).compile();

    controller = module.get<RulesetsController>(RulesetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
