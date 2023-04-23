import { Test, TestingModule } from '@nestjs/testing'
import { WXPayService } from './wxpay.service'

describe('WxpayService', () => {
  let service: WXPayService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WXPayService],
    }).compile()

    service = module.get<WXPayService>(WXPayService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
