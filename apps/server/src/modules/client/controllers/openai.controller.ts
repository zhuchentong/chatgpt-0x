import { Controller, Query, Sse } from '@nestjs/common'
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { OpenAIService } from '../services/openai.service'
import { Observable, Subscriber, from } from 'rxjs'
import { ChatMessageInput } from '../dtos/openai.dto'
import { BalanceService } from '../services/balance.service'
import { RequestUser } from 'src/decorators/request-user.decorator'
import { User } from 'src/entities/user.entity'
import { KeyService } from 'src/shared/openai/services/key.service'
import { OpenAIKeyState } from 'src/config/enum.config'

@Controller('openai')
@ApiTags('openai')
@ApiSecurity('access-token')
export class OpenaiController {
  constructor(
    private readonly openai: OpenAIService,
    private readonly balanceService: BalanceService,
    private readonly keyService: KeyService,
  ) {}

  /**
   * 尝试发送消息
   * @param input
   * @param subscriber
   * @param key
   * @param user
   * @returns
   */
  private async trySendMessage(
    { message, parentMessageId, prompt }: ChatMessageInput,
    subscriber: Subscriber<MessageEvent<any>>,
    key: string,
    user: User,
  ) {
    return this.openai
      .sendMessage(
        message,
        {
          parentMessageId,
          systemMessage: prompt,
          onProgress: (chat) => {
            subscriber.next({ data: chat } as MessageEvent)
          },
        },
        key,
      )
      .then(() => {
        subscriber.next({ data: '[DONE]' } as MessageEvent)
        subscriber.complete()
        this.balanceService.consumeUserBalance(user.id)
      })
  }

  @ApiOperation({ operationId: 'message', summary: '发送消息' })
  @Sse('message')
  async message(
    @Query() input: ChatMessageInput,
    @RequestUser() user: User,
  ): Promise<Observable<MessageEvent>> {
    // 获取用户余额
    const balance = await this.balanceService.getUserBalance(user.id)

    if (!balance) {
      return from([{ data: '[ERROR]余额不足' } as MessageEvent])
    }

    // 获取key
    let key = await this.keyService.getOpenAIKey()
    // 重置次数
    let retryCount = 0

    return new Observable((subscriber) => {
      this.trySendMessage(input, subscriber, key, user).catch(async () => {
        // 增加重试次数
        retryCount += 1
        // 监测最大重试次数
        if (retryCount > 2) {
          subscriber.next({ data: '[ERROR]对话失败' } as MessageEvent)
          subscriber.complete()
          return
        }
        // 设置key为无效
        await this.keyService.update(key, { state: OpenAIKeyState.Invalid })
        //  获取新的Key
        key = await this.keyService.getOpenAIKey()
        // 重试通化
        this.trySendMessage(input, subscriber, key, user)
      })
    })
  }
}
