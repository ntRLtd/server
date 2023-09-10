import { Test, TestingModule } from '@nestjs/testing';
import { RulesetsService } from './rulesets.service';

describe('RulesetsService', () => {
  let service: RulesetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RulesetsService],
    }).compile();

    service = module.get<RulesetsService>(RulesetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
