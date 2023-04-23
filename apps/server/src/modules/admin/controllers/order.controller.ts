import { Controller } from '@nestjs/common'
import { ApiTags, ApiSecurity } from '@nestjs/swagger'
import { WXPayService } from 'src/shared/wechat/services/wxpay.service'

@Controller('order')
@ApiTags('order')
@ApiSecurity('access-token')
export class OrderController {
  constructor(private wxpayService: WXPayService) {}
  // @Public()
  // @HttpCode(200)
  // @Post('notify')
  // @ApiOperation({})
  // async onPaymentNotify(@Query() query: any, @Body() body: any) {
  //   console.log('123', query, body)
  // }

  // @Public()
  // @Get('payment-test')
  // @ApiOperation({})
  // async testPayment() {
  //   // this.wxpayService.submitNativeOrder()

  //   const a = this.wxpayService.decrypt({
  //     ciphertext:
  //       'Lne1g6F9WGPRx4X9BpFCI28beWrnRvNVSnQsUKldaBhsgJMZnOSFdwd/aughzW+EyeMHC9l44KLukK5g43FqxhoqaDWphtUeWTjbHZ9fwma/SHw2XbN8eTkK8rEQdsfvF/kQmYFW+X451MoggAMlrqQUIizSDfc9gbM/D0aeSMarGjMbEAuaa7e7KzxY7gNMRHQ57YTcFndryuK6S/TkC2wjDNTRyxbPfbWXoqk3rcexSXO5BLeJf0nY9oyq33RbHo5/ssJTwrf+cXQl5pMzzcvEfDENpEIa7oqBlld5FOOsp0x9X5HCQky3asWlVlPU6/wft8333Ux0CxDc+b8S09g7fNwRDvted+ItsXPpo62PFnwGRdbTuQ+Eha880WxmLfc/eZnRJw9pX1eHNgEcQ7tb/HXSQRM98XLfvBiIHyRlT9uNYM185DcdxHNNk3hUO3MMZLh//lqJW/G4FOdsbLRhblyd60FzOu7aa2n6T0a3Iqp7HT+GqIVLHticn/MQFZTzM8ske7FNAZadmAayebxSfRzbvYo7NXQ9GxwdfUfXHGnLK09jIhFJ5K/SPHSpAK0zWHg=',
  //     associatedData: 'transaction',
  //     nonce: 'gNot75kjvhyl',
  //   })

  //   console.log(a)
  // }
}
