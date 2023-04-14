import { Test, TestingModule } from '@nestjs/testing';
import { WxmpService } from './wxmp.service';

describe('WxmpService', () => {
  let service: WxmpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WxmpService],
    }).compile();

    service = module.get<WxmpService>(WxmpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
