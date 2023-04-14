import { Test, TestingModule } from '@nestjs/testing'
import { WXMPController } from './wxmp.controller'

describe('WXMPController', () => {
  let controller: WXMPController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WXMPController],
    }).compile()

    controller = module.get<WXMPController>(WXMPController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
