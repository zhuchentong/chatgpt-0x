import { Test, TestingModule } from '@nestjs/testing';
import { ActiveCodeService } from './active-code.service';

describe('ActiveCodeService', () => {
  let service: ActiveCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActiveCodeService],
    }).compile();

    service = module.get<ActiveCodeService>(ActiveCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
