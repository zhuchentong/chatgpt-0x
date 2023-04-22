import { Controller, Query, Sse } from '@nestjs/common'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { OpenAIService } from '../services/openai.service'
import { Observable, from } from 'rxjs'
import { ChatMessageInput } from '../dtos/openai.dto'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { User } from 'src/entities/user.entity'
import { BalanceService } from '../services/balance.service'

@Controller('openai')
@ApiTags('openai')
@ApiSecurity('access-token')
export class OpenaiController {
  constructor(
    private readonly openai: OpenAIService,
    private readonly balanceService: BalanceService,
  ) {}

  @ApiOperation({ operationId: 'message', summary: '发送消息' })
  @Sse('message')
  async message(
    @Query() { message, parentMessageId, prompt }: ChatMessageInput,
    @RequestUser() user: User,
  ): Promise<Observable<MessageEvent>> {
    // 获取用户余额
    const balance = await this.balanceService.getUserBalance(user.id)

    if (!balance) {
      return from([{ data: '[ERROR]余额不足' } as MessageEvent])
    } else {
      this.balanceService.consumeUserBalance(user.id)
    }

    return new Observable((subscriber) => {
      this.openai
        .sendMessage(message, {
          parentMessageId,
          systemMessage: prompt,
          onProgress: (chat) => {
            subscriber.next({ data: chat } as MessageEvent)
          },
        })
        .then(() => {
          subscriber.next({ data: '[DONE]' } as MessageEvent)
          subscriber.complete()
        })
    })
  }
}
