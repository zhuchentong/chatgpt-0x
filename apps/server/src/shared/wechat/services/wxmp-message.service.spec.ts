import { Test, TestingModule } from '@nestjs/testing'
import { WXMPMessageService } from './wxmp-message.service'

describe('WXMPMessageService', () => {
  let service: WXMPMessageService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WXMPMessageService],
    }).compile()

    service = module.get<WXMPMessageService>(WXMPMessageService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
