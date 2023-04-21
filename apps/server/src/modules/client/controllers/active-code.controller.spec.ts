import { Test, TestingModule } from '@nestjs/testing';
import { ActiveCodeController } from './active-code.controller';

describe('ActiveCodeController', () => {
  let controller: ActiveCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActiveCodeController],
    }).compile();

    controller = module.get<ActiveCodeController>(ActiveCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
